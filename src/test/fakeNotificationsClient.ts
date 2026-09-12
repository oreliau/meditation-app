import type {
  DailyNotification,
  NotificationPermission,
  NotificationsClient,
} from "@/reminders/NotificationsClient";

// Records scheduling calls and lets a test script the OS permission
// answers; `scheduled` reflects what would currently be pending.
export function createFakeNotificationsClient(
  initial: NotificationPermission = "undetermined",
) {
  let permission = initial;
  let requestAnswer: NotificationPermission = "granted";
  const scheduled = new Map<string, DailyNotification>();
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
    async cancel(id) {
      scheduled.delete(id);
    },
  };

  return {
    client,
    scheduled,
    requests,
    setPermission(value: NotificationPermission) {
      permission = value;
    },
    answerRequestsWith(value: NotificationPermission) {
      requestAnswer = value;
    },
  };
}
