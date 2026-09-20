import { getSessionStore, syncSessionEndAlert } from "@meditation-app/timer";
import { useEffect } from "react";

// Mounted once at the app root, alongside SessionCompletionFeedback, so the
// alert stays armed wherever the user is — the session outlives the timer
// screen (ADR-0001).
export function SessionEndAlertScheduler() {
  useEffect(() => {
    const store = getSessionStore();

    // Covers relaunch-while-Running: restore() has already decided
    // Running vs. Completed by the time this mounts.
    syncSessionEndAlert(store.getSnapshot()).catch(() => {});

    return store.subscribe(() => {
      syncSessionEndAlert(store.getSnapshot()).catch(() => {});
    });
  }, []);

  return null;
}
