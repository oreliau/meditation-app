import { useSyncExternalStore } from "react";
import { DEFAULT_DURATION_MINUTES } from "./durations";
import {
  getSessionStore,
  type SessionSnapshot,
  type SessionStore,
} from "./sessionStore";

export type SessionTimer = SessionSnapshot &
  Pick<
    SessionStore,
    | "setDurationMinutes"
    | "setProgramContext"
    | "play"
    | "pause"
    | "stop"
    | "restart"
  >;

// What the server prerender shows before the client store takes over: an
// Idle session at the default preset.
const serverSnapshot: SessionSnapshot = {
  status: "Idle",
  isActive: false,
  remainingSeconds: DEFAULT_DURATION_MINUTES * 60,
  endsAt: undefined,
  progress: 0,
  durationMinutes: DEFAULT_DURATION_MINUTES,
  canChangeDuration: true,
};

// Thin view over the app-wide session store (see sessionStore.ts). The store
// parameter exists for tests; the app always reads the shared instance.
export function useTimerSession(
  store: SessionStore = getSessionStore(),
): SessionTimer {
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => serverSnapshot,
  );

  return {
    ...snapshot,
    setDurationMinutes: store.setDurationMinutes,
    setProgramContext: store.setProgramContext,
    play: store.play,
    pause: store.pause,
    stop: store.stop,
    restart: store.restart,
  };
}
