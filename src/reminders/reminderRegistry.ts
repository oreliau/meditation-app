import {
  cancelEveningReminder,
  scheduleEveningReminder,
} from "./eveningReminder";
import {
  cancelMorningReminder,
  scheduleMorningReminder,
} from "./morningReminder";
import type { ReminderId } from "./storage";

type ReminderActions = {
  // Idempotent per reminder: re-issues the pending notification with
  // current content.
  schedule: () => Promise<void>;
  cancel: () => Promise<void>;
};

// Every reminder the app knows, by id — the settings toggle flow and the
// foreground refresh both drive reminders through this table.
export const reminders: Record<ReminderId, ReminderActions> = {
  morning: { schedule: scheduleMorningReminder, cancel: cancelMorningReminder },
  evening: { schedule: scheduleEveningReminder, cancel: cancelEveningReminder },
};
