import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { DEFAULT_DURATION_MINUTES, type DurationMinutes } from "./durations";
import {
  type Clock,
  idleSession,
  pause,
  play,
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

export type TimerSession = {
  status: SessionStatus;
  remainingSeconds: number;
  durationMinutes: DurationMinutes;
  // The picker only applies before a session starts (Idle) or after one has
  // ended (Stopped/Completed); it's locked while Running/Paused.
  canChangeDuration: boolean;
  setDurationMinutes: (minutes: DurationMinutes) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
};

export type UseTimerSessionOptions = {
  // Fired only on natural completion (remaining time reached 0 on its own).
  // Never fired for Stop, nor for a session found already expired on relaunch.
  onCompleted?: () => void;
};

function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}

function toSeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}

function isDurationLocked(session: Session): boolean {
  return session.status === "Running" || session.status === "Paused";
}

export function useTimerSession({
  onCompleted,
}: UseTimerSessionOptions = {}): TimerSession {
  const [durationMinutes, setDurationMinutesState] = useState<DurationMinutes>(
    () => getPersistedDurationMinutes() ?? DEFAULT_DURATION_MINUTES,
  );
  const [session, setSession] = useState<Session>(() =>
    restore(getPersistedSession() ?? idleSession, Date.now()),
  );
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    toSeconds(remainingMs(session, Date.now(), minutesToMs(durationMinutes))),
  );

  // Refs mirror the latest values so the interval/AppState callbacks (and the
  // control handlers) always act on current state without re-subscribing.
  const sessionRef = useRef(session);
  const durationMinutesRef = useRef(durationMinutes);
  const onCompletedRef = useRef(onCompleted);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  const syncRemaining = useCallback((next: Session, now: number) => {
    setRemainingSeconds(
      toSeconds(
        remainingMs(next, now, minutesToMs(durationMinutesRef.current)),
      ),
    );
  }, []);

  const commit = useCallback(
    (next: Session, now: number) => {
      sessionRef.current = next;
      setSession(next);
      persistSession(next);
      syncRemaining(next, now);
    },
    [syncRemaining],
  );

  const clock = useCallback(
    (): Clock => ({
      now: Date.now(),
      durationMs: minutesToMs(durationMinutesRef.current),
    }),
    [],
  );

  const advance = useCallback(() => {
    const now = Date.now();
    const current = sessionRef.current;
    const result = tick(current, now);

    if (result.session !== current) {
      commit(result.session, now);
    } else {
      syncRemaining(current, now);
    }

    if (result.completedNaturally) {
      onCompletedRef.current?.();
    }
  }, [commit, syncRemaining]);

  useEffect(() => {
    if (session.status !== "Running") {
      return;
    }

    const interval = setInterval(advance, TICK_MS);
    // JS timers stall in the background; re-sync from the wall clock the
    // moment the app is foregrounded rather than waiting for the next tick.
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        advance();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [session.status, advance]);

  const setDurationMinutes = useCallback(
    (minutes: DurationMinutes) => {
      if (isDurationLocked(sessionRef.current)) {
        return;
      }

      durationMinutesRef.current = minutes;
      setDurationMinutesState(minutes);
      persistDurationMinutes(minutes);
      syncRemaining(sessionRef.current, Date.now());
    },
    [syncRemaining],
  );

  const handlePlay = useCallback(() => {
    const now = clock();
    commit(play(sessionRef.current, now), now.now);
  }, [clock, commit]);

  const handlePause = useCallback(() => {
    const now = Date.now();
    commit(pause(sessionRef.current, now), now);
  }, [commit]);

  const handleStop = useCallback(() => {
    commit(stop(sessionRef.current), Date.now());
  }, [commit]);

  const handleRestart = useCallback(() => {
    const now = clock();
    commit(restart(sessionRef.current, now), now.now);
  }, [clock, commit]);

  return {
    status: session.status,
    remainingSeconds,
    durationMinutes,
    canChangeDuration: !isDurationLocked(session),
    setDurationMinutes,
    play: handlePlay,
    pause: handlePause,
    stop: handleStop,
    restart: handleRestart,
  };
}
