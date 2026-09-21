import { useState, useSyncExternalStore } from "react";
import {
  DEFAULT_DURATION_MINUTES,
  getPersistedVolumePreference,
  getSessionStore,
  persistVolumePreference,
  type SessionSnapshot,
  type SessionStore,
} from "@/features/timer";

export type SessionTimer = SessionSnapshot &
  Pick<
    SessionStore,
    | "setDurationMinutes"
    | "setProgramContext"
    | "play"
    | "pause"
    | "stop"
    | "restart"
  > & {
    isVolumeEnabled: boolean;
    toggleVolume: () => void;
  };

// What the server prerender shows before the client store takes over: an
// Idle session at the default preset.
const serverSnapshot: SessionSnapshot = {
  status: "Idle",
  isActive: false,
  remainingSeconds: DEFAULT_DURATION_MINUTES * 60,
  endsAt: undefined,
  progress: 0,
  elapsedMs: 0,
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
  const isVolumeEnabledInitial = getPersistedVolumePreference() ?? true;
  const [isVolumeEnabled, setIsVolumeEnabled] = useState(
    isVolumeEnabledInitial,
  );

  const toggleVolume = () => {
    setIsVolumeEnabled((prev) => {
      const newValue = !prev;
      return newValue;
    });
    persistVolumePreference(!isVolumeEnabled);
  };

  const pause = () => {
    store.pause();
    persistVolumePreference(false);
  };

  const stop = () => {
    store.stop();
    persistVolumePreference(false);
  };

  const play = () => {
    store.play();
    persistVolumePreference(true);
  };

  const restart = () => {
    store.restart();
  };

  return {
    ...snapshot,
    setDurationMinutes: store.setDurationMinutes,
    setProgramContext: store.setProgramContext,
    play,
    pause,
    stop,
    restart,
    isVolumeEnabled,
    toggleVolume,
  };
}
