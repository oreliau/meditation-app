import {
  type AudioPlayer,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { createMMKV, useMMKVListener } from "react-native-mmkv";
import {
  getPersistedVolumePreference,
  getSessionStore,
  type SessionSnapshot,
  type SessionStore,
  timerStorage,
  VOLUME_PREFERENCE_KEY,
} from "@/features/timer";
import {
  DEFAULT_SOUNDSCAPE_ID,
  getSoundscapeSource,
  isSoundscapeId,
  type SoundscapeId,
} from "./soundscapeSources";

const SOUNDSCAPE_KEY = "activeSoundscape";
const soundscapeStorage = createMMKV({ id: "aura-soundscape-playback" });

function isActive(status: SessionSnapshot["status"]): boolean {
  return status === "Running" || status === "Paused";
}

const VOLUME = {
  LOW: 0.1,
  MUTE: 0,
};

// The controller lives at the app root because a Session outlives its timer
// screen. Audio errors are deliberately swallowed: the timer is always usable
// without a Soundscape.
export function useSoundscapePlayback(options?: {
  store?: SessionStore;
  getSoundscape?: () => string | undefined;
}): void {
  const sessionStoreOverride = options?.store;
  const getSoundscapeOverride = options?.getSoundscape;
  const playerRef = useRef<AudioPlayer | null>(null);
  const activeSoundscapeRef = useRef<SoundscapeId>(DEFAULT_SOUNDSCAPE_ID);
  const generationRef = useRef(0);
  const volumeEnabledRef = useRef(getPersistedVolumePreference() ?? true);
  const shouldBePlayingRef = useRef(false);
  const sourceReadyRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  useMMKVListener((key) => {
    if (key !== VOLUME_PREFERENCE_KEY) return;
    const enabled = getPersistedVolumePreference() ?? true;
    volumeEnabledRef.current = enabled;
    if (playerRef.current) {
      playerRef.current.volume = enabled ? VOLUME.LOW : VOLUME.MUTE;
    }
  }, timerStorage);

  useEffect(() => {
    let disposed = false;
    const sessionStore = sessionStoreOverride ?? getSessionStore();
    const readSoundscape = getSoundscapeOverride ?? (() => undefined);

    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "doNotMix",
      shouldPlayInBackground: false,
    }).catch(() => {
      // Audio mode is best-effort; unsupported environments stay silent.
    });

    let player: AudioPlayer;
    try {
      player = createAudioPlayer(undefined, {
        keepAudioSessionActive: true,
      });
    } catch {
      return;
    }
    player.loop = true;
    player.volume = volumeEnabledRef.current ? VOLUME.LOW : VOLUME.MUTE;
    playerRef.current = player;

    const stop = () => {
      generationRef.current += 1;
      shouldBePlayingRef.current = false;
      preferPersistedSoundscape = false;
      player.pause();
      player.setActiveForLockScreen(false);
      player.seekTo(0).catch(() => {});
      soundscapeStorage.remove(SOUNDSCAPE_KEY);
      setAudioModeAsync({
        interruptionMode: "mixWithOthers",
        shouldPlayInBackground: false,
      }).catch(() => {});
    };

    const start = (reset: boolean) => {
      if (appStateRef.current === "background") {
        shouldBePlayingRef.current = false;
        return;
      }

      const generation = ++generationRef.current;
      shouldBePlayingRef.current = true;
      player.loop = true;
      player.volume = volumeEnabledRef.current ? VOLUME.LOW : VOLUME.MUTE;
      if (reset || !sourceReadyRef.current) {
        try {
          player.replace(getSoundscapeSource(activeSoundscapeRef.current));
          sourceReadyRef.current = true;
        } catch {
          return;
        }
        player.seekTo(0).then(
          () => {
            if (!disposed && generation === generationRef.current) {
              player.play();
            }
          },
          () => {},
        );
      } else {
        player.play();
      }
      player.setActiveForLockScreen(true);
    };

    const playbackSubscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (
          shouldBePlayingRef.current &&
          !status.playing &&
          !status.isBuffering
        ) {
          player.play();
        }
      },
    );

    const sync = (next: SessionSnapshot, previous: SessionSnapshot) => {
      if (next.status === "Running") {
        const restarted =
          previous.status === "Running" && previous.endsAt !== next.endsAt;
        const began = !isActive(previous.status);
        if (began || restarted) {
          const selected = preferPersistedSoundscape
            ? activeSoundscapeRef.current
            : readSoundscape();
          activeSoundscapeRef.current = isSoundscapeId(selected)
            ? selected
            : DEFAULT_SOUNDSCAPE_ID;
          soundscapeStorage.set(SOUNDSCAPE_KEY, activeSoundscapeRef.current);
          preferPersistedSoundscape = false;
        }
        start(began || restarted);
      } else if (next.status === "Paused") {
        player.pause();
      } else {
        stop();
      }
    };

    const persistedSoundscape = soundscapeStorage.getString(SOUNDSCAPE_KEY);
    let previous = sessionStore.getSnapshot();
    let preferPersistedSoundscape =
      isActive(previous.status) && isSoundscapeId(persistedSoundscape);
    if (isSoundscapeId(persistedSoundscape)) {
      activeSoundscapeRef.current = persistedSoundscape;
    }

    sync(previous, { ...previous, status: "Idle", endsAt: undefined });
    const unsubscribe = sessionStore.subscribe(() => {
      const next = sessionStore.getSnapshot();
      sync(next, previous);
      previous = next;
    });
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        const wasBackgrounded = appStateRef.current === "background";
        appStateRef.current = state;

        if (state === "background") {
          generationRef.current += 1;
          shouldBePlayingRef.current = false;
          player.pause();
          player.setActiveForLockScreen(false);
        } else if (
          wasBackgrounded &&
          state === "active" &&
          sessionStore.getSnapshot().status === "Running"
        ) {
          start(false);
        }
      },
    );

    return () => {
      disposed = true;
      unsubscribe();
      appStateSubscription.remove();
      playbackSubscription.remove();
      generationRef.current += 1;
      shouldBePlayingRef.current = false;
      player.setActiveForLockScreen(false);
      player.remove();
      playerRef.current = null;
    };
  }, [getSoundscapeOverride, sessionStoreOverride]);
}
