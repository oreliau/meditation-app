import * as Notifications from "expo-notifications";
import { AppState } from "react-native";
import type {
  NotificationPermission,
  NotificationsClient,
} from "./NotificationsClient";
import { notificationPresentation } from "./notificationPresentation";

// Android requires a channel for scheduled notifications to be delivered;
// iOS ignores it.
const CHANNEL_ID = "reminders";
// Separate from CHANNEL_ID so users can control Session-end alerts
// independently of Reminders in Android's per-channel notification settings.
const SESSION_END_ALERT_CHANNEL_ID = "session-end-alert";

function toPermission(
  response: Notifications.NotificationPermissionsStatus,
): NotificationPermission {
  if (response.granted) {
    return "granted";
  }
  return response.canAskAgain ? "undetermined" : "denied";
}

// expo-notifications adapter (native only — see the .web counterpart).
// Local scheduling only: no push token, no server, so it works in Expo Go.
export function createNotificationService(): NotificationsClient {
  // Reminders should also be seen if the app happens to be open at 8:00.
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => ({
      ...notificationPresentation(
        notification.request.content.data as { kind?: string } | undefined,
        AppState.currentState === "background" ? "background" : "active",
      ),
      shouldSetBadge: false,
    }),
  });

  const channelReady = Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  const sessionEndAlertChannelReady = Notifications.setNotificationChannelAsync(
    SESSION_END_ALERT_CHANNEL_ID,
    {
      name: "Session-end alert",
      importance: Notifications.AndroidImportance.DEFAULT,
    },
  );

  return {
    async getPermission() {
      return toPermission(await Notifications.getPermissionsAsync());
    },

    async requestPermission() {
      return toPermission(await Notifications.requestPermissionsAsync());
    },

    async scheduleDaily({ id, hour, minute, title, body }) {
      await channelReady;
      // Scheduling with an existing identifier replaces it on iOS but not
      // reliably on Android, so cancel explicitly first.
      await Notifications.cancelScheduledNotificationAsync(id);
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: { title, body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: CHANNEL_ID,
        },
      });
    },

    async scheduleAt({ id, date, title, body, data }) {
      await sessionEndAlertChannelReady;
      // Scheduling with an existing identifier replaces it on iOS but not
      // reliably on Android, so cancel explicitly first.
      await Notifications.cancelScheduledNotificationAsync(id);
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: { title, body, data },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: SESSION_END_ALERT_CHANNEL_ID,
        },
      });
    },

    async cancel(id) {
      await Notifications.cancelScheduledNotificationAsync(id);
    },
  };
}
