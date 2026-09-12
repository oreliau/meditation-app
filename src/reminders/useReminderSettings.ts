import { useState } from "react";
import { ensureNotificationPermission } from "./permission";
import { reminders } from "./reminderRegistry";
import {
  isReminderEnabled,
  type ReminderId,
  setReminderEnabled,
} from "./storage";

export type ReminderSettings = {
  morningEnabled: boolean;
  eveningEnabled: boolean;
  // True after an attempt to turn a reminder on was refused by the OS: the
  // Settings screen shows an inline "enable in device settings" prompt
  // rather than a toggle that silently does nothing.
  permissionDenied: boolean;
  setMorningEnabled: (enabled: boolean) => Promise<void>;
  setEveningEnabled: (enabled: boolean) => Promise<void>;
};

export function useReminderSettings(): ReminderSettings {
  const [enabled, setEnabledState] = useState<Record<ReminderId, boolean>>(
    () => ({
      morning: isReminderEnabled("morning"),
      evening: isReminderEnabled("evening"),
    }),
  );
  const [permissionDenied, setPermissionDenied] = useState(false);

  // One flow for every reminder: just-in-time permission, then persist and
  // schedule (or cancel).
  async function setEnabled(reminder: ReminderId, value: boolean) {
    if (!value) {
      setReminderEnabled(reminder, false);
      setEnabledState((s) => ({ ...s, [reminder]: false }));
      setPermissionDenied(false);
      await reminders[reminder].cancel();
      return;
    }
    const granted = await ensureNotificationPermission();
    setPermissionDenied(!granted);
    if (!granted) {
      return;
    }
    setReminderEnabled(reminder, true);
    setEnabledState((s) => ({ ...s, [reminder]: true }));
    await reminders[reminder].schedule();
  }

  const setMorningEnabled = (value: boolean) => setEnabled("morning", value);
  const setEveningEnabled = (value: boolean) => setEnabled("evening", value);

  return {
    morningEnabled: enabled.morning,
    eveningEnabled: enabled.evening,
    permissionDenied,
    setMorningEnabled,
    setEveningEnabled,
  };
}
