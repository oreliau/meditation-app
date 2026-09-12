import { getNotificationsClient } from "./NotificationsClient";

// Just-in-time permission: only ask the OS when the user turns a reminder
// on, and only if they haven't already answered. A prior "denied" can't be
// re-prompted on either platform, so the caller shows the "enable in
// device settings" prompt instead.
export async function ensureNotificationPermission(): Promise<boolean> {
  const client = getNotificationsClient();
  const current = await client.getPermission();
  if (current === "granted") {
    return true;
  }
  if (current === "denied") {
    return false;
  }
  return (await client.requestPermission()) === "granted";
}
