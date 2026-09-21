import { useEffect } from "react";
import { useCompletionFeedback } from "@/features/audio-feedback/useCompletionFeedback";
import { getSessionStore } from "@/features/timer";

// Mounted once at the app root so completion feedback fires wherever the
// user is when a session reaches 0 — the session outlives the timer screen.
export function SessionCompletionFeedback() {
  const playCompletionFeedback = useCompletionFeedback();

  useEffect(
    () => getSessionStore().subscribeToCompletion(playCompletionFeedback),
    [playCompletionFeedback],
  );

  return null;
}
