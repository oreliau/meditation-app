import type {
  DailyNotification,
  NotificationPermission,
  NotificationsClient,
  OneTimeNotification,
} from "@/reminders";

// Records scheduling calls and lets a test script the OS permission
// answers; `scheduled`/`scheduledOnce` reflect what would currently be
// pending.
export function createFakeNotificationsClient(
  initial: NotificationPermission = "undetermined",
) {
  let permission = initial;
  let requestAnswer: NotificationPermission = "granted";
  const scheduled = new Map<string, DailyNotification>();
  const scheduledOnce = new Map<string, OneTimeNotification>();
  const requests: number[] = [];

  const client: NotificationsClient = {
    async getPermission() {
      return permission;
    },
    async requestPermission() {
      requests.push(Date.now());
      permission = requestAnswer;
      return permission;
    },
    async scheduleDaily(notification) {
      scheduled.set(notification.id, notification);
    },
    async scheduleAt(notification) {
      scheduledOnce.set(notification.id, notification);
    },
    async cancel(id) {
      scheduled.delete(id);
      scheduledOnce.delete(id);
    },
  };

  return {
    client,
    scheduled,
    scheduledOnce,
    requests,
    setPermission(value: NotificationPermission) {
      permission = value;
    },
    answerRequestsWith(value: NotificationPermission) {
      requestAnswer = value;
    },
  };
}
