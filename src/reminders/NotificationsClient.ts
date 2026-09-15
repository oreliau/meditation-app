// Domain interface for local daily reminders. Same shape as
// src/theme/ThemeRuntime.ts: the app installs the expo-notifications
// adapter at startup, tests install a fake, and the reminder logic never
// imports expo-notifications itself.

export type NotificationPermission = "granted" | "denied" | "undetermined";

export type DailyNotification = {
  // Stable per reminder: scheduling again with the same id replaces the
  // pending one, which is how content gets refreshed.
  id: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export type OneTimeNotification = {
  // Stable per alert: scheduling again with the same id replaces the
  // pending one, which is how a moved end time gets rescheduled.
  id: string;
  date: number; // absolute epoch ms
  title: string;
  body: string;
};

export interface NotificationsClient {
  getPermission(): Promise<NotificationPermission>;
  requestPermission(): Promise<NotificationPermission>;
  // Repeats every day at hour:minute, device-local time.
  scheduleDaily(notification: DailyNotification): Promise<void>;
  // Fires once at an absolute time, independent of whether the app is
  // running, backgrounded, or killed when that time arrives.
  scheduleAt(notification: OneTimeNotification): Promise<void>;
  cancel(id: string): Promise<void>;
}

let client: NotificationsClient | undefined;

export function setNotificationsClient(c: NotificationsClient): void {
  client = c;
}

export function getNotificationsClient(): NotificationsClient {
  if (!client) {
    throw new Error(
      "NotificationsClient not initialized. Call setNotificationsClient() at app startup.",
    );
  }
  return client;
}
