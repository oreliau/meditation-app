import { reminders } from "./reminderRegistry";
import { isReminderEnabled, type ReminderId } from "./storage";

// Foreground hook point: re-issue every enabled reminder with fresh content
// (the morning sentence for its next delivery day, an evening message
// composed from today's stats). Safe to call often.
export async function refreshReminders(): Promise<void> {
  const enabled = (Object.keys(reminders) as ReminderId[]).filter(
    isReminderEnabled,
  );
  await Promise.all(enabled.map((id) => reminders[id].schedule()));
}
