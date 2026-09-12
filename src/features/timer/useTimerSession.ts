import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { DEFAULT_DURATION_MINUTES, type DurationMinutes } from "./durations";
import {
  idleSession,
  isActive,
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
  // Running or Paused: there is a session underway that Stop can end.
  isActive: boolean;
  remainingSeconds: number;
  durationMinutes: DurationMinutes;
  // The picker only applies before a session starts (Idle) or after one has
  // ended (Stopped/Completed); it's locked while a session is active.
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

  // restore() may have moved a stored Running session to Completed; write
  // that back so storage never lags behind what the user was shown.
  useEffect(() => {
    persistSession(sessionRef.current);
  }, []);

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
      if (isActive(sessionRef.current)) {
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
    const now = Date.now();
    commit(
      play(sessionRef.current, now, minutesToMs(durationMinutesRef.current)),
      now,
    );
  }, [commit]);

  const handlePause = useCallback(() => {
    const now = Date.now();
    commit(pause(sessionRef.current, now), now);
  }, [commit]);

  const handleStop = useCallback(() => {
    commit(stop(sessionRef.current), Date.now());
  }, [commit]);

  const handleRestart = useCallback(() => {
    const now = Date.now();
    commit(
      restart(sessionRef.current, now, minutesToMs(durationMinutesRef.current)),
      now,
    );
  }, [commit]);

  return {
    status: session.status,
    isActive: isActive(session),
    remainingSeconds,
    durationMinutes,
    canChangeDuration: !isActive(session),
    setDurationMinutes,
    play: handlePlay,
    pause: handlePause,
    stop: handleStop,
    restart: handleRestart,
  };
}
