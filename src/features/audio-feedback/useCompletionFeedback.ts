import {
  type AudioPlayer,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { getPersistedVolumePreference } from "@/features/timer";

// PLACEHOLDER tone (ADR-0003): a generated 0.7 s sine "ding", not a designed
// bell. Swap the asset here when the real sound is specified.
const completionChime = require("../../../assets/sounds/completion-chime-placeholder.wav");

// Haptic pulse + chime for natural completion only. Callers must not invoke
// this for Stop, nor for a session found already expired on relaunch (see
// SessionStore.subscribeToCompletion's contract).
export function useCompletionFeedback(): () => void {
  const playerRef = useRef<AudioPlayer | null>(null);

  // Created in an effect rather than via useAudioPlayer(): the web player
  // constructs an HTMLAudioElement, which doesn't exist while Expo Router
  // prerenders this route server-side. Effects never run there.
  useEffect(() => {
    // A meditation is typically run with the ringer muted; without this the
    // chime is silently swallowed by the iOS silent switch (ADR-0003).
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {
      // Best-effort; unsupported platforms ignore audio mode.
    });

    const player = createAudioPlayer(completionChime);
    playerRef.current = player;

    return () => {
      playerRef.current = null;
      player.remove();
    };
  }, []);

  return () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {
        // Haptics are best-effort: unsupported devices/browsers stay silent.
      },
    );

    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (!getPersistedVolumePreference()) {
      return;
    }

    player.seekTo(0).then(
      () => player.play(),
      () => {
        // Same for audio: a failed seek/play must never break the session.
      },
    );
  };
}
