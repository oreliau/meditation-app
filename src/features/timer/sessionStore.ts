import { AppState } from "react-native";
import { DEFAULT_DURATION_MINUTES, type DurationMinutes } from "./durations";
import {
  idleSession,
  isActive,
  pause,
  play,
  progress,
  remainingMs,
  restart,
  restore,
  type Session,
  type SessionStatus,
  stop,
  tick,
} from "./session";
import {
  getPersistedDurationMinutes,
  getPersistedSession,
  persistDurationMinutes,
  persistSession,
} from "./storage";

// Sub-second so the displayed second flips close to the real boundary; the
// remaining time itself always comes from the wall clock, never from
// counting ticks, so drift or stalled timers can't desync it.
const TICK_MS = 250;

export type SessionSnapshot = {
  status: SessionStatus;
  // Running or Paused: there is a session underway that Stop can end.
  isActive: boolean;
  remainingSeconds: number;
  // Fraction of the session elapsed, 0..1, for the progress ring.
  progress: number;
  durationMinutes: DurationMinutes;
  // The picker only applies before a session starts (Idle) or after one has
  // ended (Stopped/Completed); it's locked while a session is active.
  canChangeDuration: boolean;
};

export type SessionStore = {
  getSnapshot: () => SessionSnapshot;
  subscribe: (listener: () => void) => () => void;
  // Fired only on natural completion (remaining time reached 0 on its own).
  // Never fired for Stop, nor for a session found already expired on relaunch.
  subscribeToCompletion: (listener: () => void) => () => void;
  setDurationMinutes: (minutes: DurationMinutes) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
};

function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}

function toSeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}

function snapshotOf(
  session: Session,
  durationMinutes: DurationMinutes,
  now: number,
): SessionSnapshot {
  return {
    status: session.status,
    isActive: isActive(session),
    remainingSeconds: toSeconds(
      remainingMs(session, now, minutesToMs(durationMinutes)),
    ),
    progress: progress(session, now, minutesToMs(durationMinutes)),
    durationMinutes,
    canChangeDuration: !isActive(session),
  };
}

// ADR-0001: the session outlives any screen — it keeps counting (and
// completes, with feedback) while the user is elsewhere in the app. Screens
// subscribe to it; they never own it. `createSessionStore` is exported for
// tests; the app uses the lazy singleton from `getSessionStore()`.
export function createSessionStore(): SessionStore {
  const now = Date.now();
  let durationMinutes =
    getPersistedDurationMinutes() ?? DEFAULT_DURATION_MINUTES;
  let session = restore(getPersistedSession() ?? idleSession, now);
  let snapshot = snapshotOf(session, durationMinutes, now);
  // restore() may have moved an expired Running session to Completed; write
  // it back so storage never lags behind what the user is shown.
  persistSession(session);

  const listeners = new Set<() => void>();
  const completionListeners = new Set<() => void>();
  let interval: ReturnType<typeof setInterval> | undefined;

  function publish(now: number) {
    const next = snapshotOf(session, durationMinutes, now);

    if (
      next.status === snapshot.status &&
      next.remainingSeconds === snapshot.remainingSeconds &&
      next.durationMinutes === snapshot.durationMinutes
    ) {
      return;
    }

    snapshot = next;
    for (const listener of listeners) {
      listener();
    }
  }

  function syncTicking() {
    if (session.status === "Running" && interval === undefined) {
      interval = setInterval(advance, TICK_MS);
    } else if (session.status !== "Running" && interval !== undefined) {
      clearInterval(interval);
      interval = undefined;
    }
  }

  function commit(next: Session, now: number) {
    session = next;
    persistSession(next);
    syncTicking();
    publish(now);
  }

  function advance() {
    const now = Date.now();
    const result = tick(session, now);

    if (result.session !== session) {
      commit(result.session, now);
    } else {
      publish(now);
    }

    if (result.completedNaturally) {
      for (const listener of completionListeners) {
        listener();
      }
    }
  }

  // JS timers stall in the background; re-sync from the wall clock the
  // moment the app is foregrounded rather than waiting for the next tick.
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      advance();
    }
  });

  syncTicking();

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    subscribeToCompletion(listener) {
      completionListeners.add(listener);
      return () => {
        completionListeners.delete(listener);
      };
    },
    setDurationMinutes(minutes) {
      if (isActive(session)) {
        return;
      }

      durationMinutes = minutes;
      persistDurationMinutes(minutes);
      publish(Date.now());
    },
    play() {
      const now = Date.now();
      commit(play(session, now, minutesToMs(durationMinutes)), now);
    },
    pause() {
      const now = Date.now();
      commit(pause(session, now), now);
    },
    stop() {
      commit(stop(session), Date.now());
    },
    restart() {
      const now = Date.now();
      commit(restart(session, now, minutesToMs(durationMinutes)), now);
    },
  };
}

let appSessionStore: SessionStore | undefined;

// Lazily created on first use so importing this module has no side effects
// (no storage reads, no timers) — Expo Router evaluates route modules
// server-side to prerender web routes (ADR-0001).
export function getSessionStore(): SessionStore {
  appSessionStore ??= createSessionStore();

  return appSessionStore;
}
