import { getSessionStore } from "@meditation-app/timer";
import { router } from "expo-router";
import { useEffect } from "react";

// Mounted once at the app root (like SessionCompletionFeedback and
// useRecordCompletedSessions) so the celebratory takeover appears wherever
// the user is when a session completes — the session outlives any screen
// (ADR-0001). Natural completion only; captures duration/program context at
// the moment it fires rather than letting the completion screen re-read the
// store later, since Done resets it back to Idle.
export function useNavigateToCompletion(): void {
  useEffect(() => {
    const store = getSessionStore();

    return store.subscribeToCompletion((programContext) => {
      router.push({
        pathname: "/session-complete",
        params: {
          durationMinutes: String(store.getSnapshot().durationMinutes),
          ...(programContext ? { programId: programContext.programId } : {}),
        },
      });
    });
  }, []);
}
