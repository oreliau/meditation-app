import { setNotificationsClient } from "./NotificationsClient";

export function initializeNotifications(): void {
  const { createNotificationService } = require("./notification-service");
  setNotificationsClient(createNotificationService());
}
