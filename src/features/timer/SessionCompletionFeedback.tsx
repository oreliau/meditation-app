import { useEffect } from "react";
import { getSessionStore } from "./sessionStore";
import { useCompletionFeedback } from "./useCompletionFeedback";

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
