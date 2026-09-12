import type { NotificationsClient } from "./NotificationsClient";

// Reminders are mobile-only: the Settings screen doesn't exist on web (see
// src/app/settings.web.tsx), so nothing ever schedules here. This keeps
// expo-notifications out of the web bundle entirely.
export function createExpoNotificationsClient(): NotificationsClient {
  return {
    async getPermission() {
      return "denied";
    },
    async requestPermission() {
      return "denied";
    },
    async scheduleDaily() {},
    async cancel() {},
  };
}
