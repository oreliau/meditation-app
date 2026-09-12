import { getDailyStats } from "@/stats/dailyStats";
import { composeEveningSummary } from "./eveningSummary";
import { getNotificationsClient } from "./NotificationsClient";

export const EVENING_REMINDER_ID = "evening-summary";
// 18:00 device-local time (DAILY trigger, see morningReminder.ts).
export const EVENING_REMINDER_HOUR = 18;
export const EVENING_REMINDER_MINUTE = 0;

// (Re)schedules the evening summary from today's Daily stats. Called when
// the toggle is turned on and on every app foreground, so by 18:00 the
// pending message reflects whatever the user did today.
export async function scheduleEveningReminder(): Promise<void> {
  const { title, body } = composeEveningSummary(getDailyStats());
  await getNotificationsClient().scheduleDaily({
    id: EVENING_REMINDER_ID,
    hour: EVENING_REMINDER_HOUR,
    minute: EVENING_REMINDER_MINUTE,
    title,
    body,
  });
}

export async function cancelEveningReminder(): Promise<void> {
  await getNotificationsClient().cancel(EVENING_REMINDER_ID);
}
