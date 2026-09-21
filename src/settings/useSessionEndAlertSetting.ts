import { useState } from "react";
import {
  getSessionStore,
  isSessionEndAlertEnabled,
  setSessionEndAlertEnabled,
  syncSessionEndAlert,
} from "@/features/timer";
import { ensureNotificationPermission } from "@/reminders";

export type SessionEndAlertSetting = {
  enabled: boolean;
  // True after an attempt to turn the alert on was refused by the OS: the
  // Settings screen shows an inline "enable in device settings" prompt
  // rather than a toggle that silently does nothing.
  permissionDenied: boolean;
  setEnabled: (enabled: boolean) => Promise<void>;
};

export function useSessionEndAlertSetting(): SessionEndAlertSetting {
  const [enabled, setEnabledState] = useState(isSessionEndAlertEnabled);
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function setEnabled(value: boolean) {
    if (!value) {
      setSessionEndAlertEnabled(false);
      setEnabledState(false);
      setPermissionDenied(false);
      await syncSessionEndAlert(getSessionStore().getSnapshot());
      return;
    }

    const granted = await ensureNotificationPermission();
    setPermissionDenied(!granted);
    if (!granted) {
      return;
    }

    setSessionEndAlertEnabled(true);
    setEnabledState(true);
    // Arms immediately if a session happens to already be Running, rather
    // than waiting for the next session-store change.
    await syncSessionEndAlert(getSessionStore().getSnapshot());
  }

  return { enabled, permissionDenied, setEnabled };
}
