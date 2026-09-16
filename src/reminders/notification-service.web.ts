import type {
  DailyNotification,
  NotificationsClient,
  OneTimeNotification,
} from "./NotificationsClient";

// Reminders are mobile-only: the Settings screen doesn't exist on web (see
// src/app/settings.web.tsx), so nothing ever schedules here. This keeps
// expo-notifications out of the web bundle entirely.
function getBrowserNotification(): typeof Notification | undefined {
  if (
    typeof window === "undefined" ||
    typeof window.Notification === "undefined"
  ) {
    return undefined;
  }
  return window.Notification;
}

const MAX_TIMEOUT = 2_147_483_647;

function nextDailyDelivery(hour: number, minute: number): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

export function createNotificationService(): NotificationsClient {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function cancelTimer(id: string): void {
    const timer = timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }

  function scheduleTimer(
    id: string,
    targetTime: number,
    callback: () => void,
  ): void {
    const delay = Math.max(0, targetTime - Date.now());
    timers.set(
      id,
      setTimeout(
        () => {
          if (delay > MAX_TIMEOUT) {
            scheduleTimer(id, targetTime, callback);
            return;
          }
          timers.delete(id);
          callback();
        },
        Math.min(delay, MAX_TIMEOUT),
      ),
    );
  }

  function show(notification: DailyNotification | OneTimeNotification): void {
    const browserNotification = getBrowserNotification();

    if (browserNotification?.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        tag: notification.id,
        icon: "/assets/images/icon.png",
      });
    }
  }

  return {
    async getPermission() {
      const browserNotification = getBrowserNotification();
      if (!browserNotification) {
        return "denied";
      }
      return browserNotification.permission === "default"
        ? "undetermined"
        : browserNotification.permission;
    },
    async requestPermission() {
      const browserNotification = getBrowserNotification();
      if (!browserNotification) {
        return "denied";
      }
      const permission = await browserNotification.requestPermission();
      return permission === "default" ? "undetermined" : permission;
    },
    async scheduleDaily(notification) {
      console.log("scheduleDaily:", notification.id);
      cancelTimer(notification.id);
      const scheduleNext = () => {
        show(notification);
        scheduleTimer(
          notification.id,
          nextDailyDelivery(notification.hour, notification.minute),
          scheduleNext,
        );
      };
      scheduleTimer(
        notification.id,
        nextDailyDelivery(notification.hour, notification.minute),
        scheduleNext,
      );
    },
    async scheduleAt(notification) {
      console.log("scheduleAt:", notification.id);
      cancelTimer(notification.id);
      scheduleTimer(notification.id, notification.date, () =>
        show(notification),
      );
    },
    async cancel(id) {
      cancelTimer(id);
    },
  };
}
