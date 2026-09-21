import { createMMKV } from "react-native-mmkv";

// Same shape as src/theme/storage.ts. Reminders are mobile-only (the
// Settings screen is a .web override away from existing there), so no
// `window` guard is needed for the static web prerender.
export const remindersStorage = createMMKV({ id: "aura-reminders" });

export type ReminderId = "morning" | "evening";

const ENABLED_KEY: Record<ReminderId, string> = {
  morning: "morningReminderEnabled",
  evening: "eveningReminderEnabled",
};

export const MORNING_SENTENCE_OFFSET_KEY = "morningSentenceOffset";

export function isReminderEnabled(reminder: ReminderId): boolean {
  return remindersStorage.getBoolean(ENABLED_KEY[reminder]) ?? false;
}

export function setReminderEnabled(
  reminder: ReminderId,
  enabled: boolean,
): void {
  remindersStorage.set(ENABLED_KEY[reminder], enabled);
}

// Per-install starting point of the sentence rotation (see rotation.ts),
// chosen once.
export function getMorningSentenceOffset(): number | undefined {
  return remindersStorage.getNumber(MORNING_SENTENCE_OFFSET_KEY);
}

export function setMorningSentenceOffset(offset: number): void {
  remindersStorage.set(MORNING_SENTENCE_OFFSET_KEY, offset);
}
