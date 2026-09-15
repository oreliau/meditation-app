import { createMMKV } from "react-native-mmkv";

// Same shape as src/reminders/storage.ts. A separate instance because
// Session-end alert is a distinct concept from a Reminder (see CONTEXT.md).
export const sessionEndAlertStorage = createMMKV({
  id: "aura-session-end-alert",
});

const ENABLED_KEY = "sessionEndAlertEnabled";

export function isSessionEndAlertEnabled(): boolean {
  return sessionEndAlertStorage.getBoolean(ENABLED_KEY) ?? false;
}

export function setSessionEndAlertEnabled(enabled: boolean): void {
  sessionEndAlertStorage.set(ENABLED_KEY, enabled);
}
