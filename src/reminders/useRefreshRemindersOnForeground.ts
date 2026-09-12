import { useEffect } from "react";
import { AppState } from "react-native";
import { refreshReminders } from "./refreshReminders";

// Rotates the content of every enabled reminder each time the app comes to
// the foreground (and once at launch). Mount once, in the root layout.
export function useRefreshRemindersOnForeground(): void {
  useEffect(() => {
    refreshReminders().catch(() => {});
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshReminders().catch(() => {});
      }
    });
    return () => subscription.remove();
  }, []);
}
