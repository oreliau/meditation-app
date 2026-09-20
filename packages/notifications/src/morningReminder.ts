import { getNotificationsClient } from "./NotificationsClient";
import { PRESENCE_SENTENCES } from "./presenceSentences";
import { nextDeliveryDayNumber, sentenceIndexForDay } from "./rotation";
import { getMorningSentenceOffset, setMorningSentenceOffset } from "./storage";

export const MORNING_REMINDER_ID = "morning-presence";
// 8:00 device-local time; expo-notifications' DAILY trigger is local-time
// by definition, so a timezone change just moves with the device.
export const MORNING_REMINDER_HOUR = 8;
export const MORNING_REMINDER_MINUTE = 0;

function morningSentenceOffset(): number {
  const stored = getMorningSentenceOffset();
  if (stored !== undefined) {
    return stored;
  }
  const offset = Math.floor(Math.random() * PRESENCE_SENTENCES.length);
  setMorningSentenceOffset(offset);
  return offset;
}

// (Re)schedules the morning reminder with the sentence for its next
// delivery day. Called when the toggle is turned on and on every app
// foreground, so the pending notification's content keeps moving day to
// day (see rotation.ts for the no-repeat guarantee).
export async function scheduleMorningReminder(): Promise<void> {
  const index = sentenceIndexForDay(
    nextDeliveryDayNumber(
      new Date(),
      MORNING_REMINDER_HOUR,
      MORNING_REMINDER_MINUTE,
    ),
    PRESENCE_SENTENCES.length,
    morningSentenceOffset(),
  );
  await getNotificationsClient().scheduleDaily({
    id: MORNING_REMINDER_ID,
    hour: MORNING_REMINDER_HOUR,
    minute: MORNING_REMINDER_MINUTE,
    title: "Morning presence",
    body: PRESENCE_SENTENCES[index] ?? PRESENCE_SENTENCES[0],
  });
}

export async function cancelMorningReminder(): Promise<void> {
  await getNotificationsClient().cancel(MORNING_REMINDER_ID);
}
