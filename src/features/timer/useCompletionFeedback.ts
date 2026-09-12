import {
  type AudioPlayer,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef } from "react";

// PLACEHOLDER tone: a generated 0.7 s sine "ding", not a designed bell. The
// real completion sound is deferred to a future ADR — swap the asset there,
// nothing else here needs to change.
const completionChime = require("@/assets/sounds/completion-chime-placeholder.wav");

// Haptic pulse + chime for natural completion only. Callers must not invoke
// this for Stop, nor for a session found already expired on relaunch (see
// useTimerSession's onCompleted contract).
export function useCompletionFeedback(): () => void {
  const playerRef = useRef<AudioPlayer | null>(null);

  // Created in an effect rather than via useAudioPlayer(): the web player
  // constructs an HTMLAudioElement, which doesn't exist while Expo Router
  // prerenders this route server-side. Effects never run there.
  useEffect(() => {
    // A meditation is typically run with the ringer muted; without this the
    // chime is silently swallowed by the iOS silent switch.
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

  return useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {
        // Haptics are best-effort: unsupported devices/browsers stay silent.
      },
    );

    const player = playerRef.current;

    if (!player) {
      return;
    }

    player.seekTo(0).then(
      () => player.play(),
      () => {
        // Same for audio: a failed seek/play must never break the session.
      },
    );
  }, []);
}
