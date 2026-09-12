import { useEffect } from "react";
import { getSessionStore } from "@/features/timer/sessionStore";
import { recordSessionCompleted } from "./dailyStats";

// Feeds Daily stats from the timer: mounted once at the app root (like
// SessionCompletionFeedback) so a session that completes while the user is
// on another screen is still counted. Natural completion only — the store's
// completion subscription never fires for Stop or a relaunch after expiry.
export function useRecordCompletedSessions(): void {
  useEffect(() => {
    const store = getSessionStore();
    return store.subscribeToCompletion(() => {
      recordSessionCompleted(store.getSnapshot().durationMinutes * 60);
    });
  }, []);
}
