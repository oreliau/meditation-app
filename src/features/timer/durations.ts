import {
  createTranslator,
  formatNumber,
  getInitialLanguage,
  pluralCategory,
} from "@/i18n";

// Fixed duration presets offered by the picker, in minutes. The default
// matches the mockups' static "12:00" display.
export const DURATION_PRESETS_MINUTES = [
  0.1, 0.5, 3, 5, 10, 12, 15, 20, 30, 45, 60, 90, 120,
] as const;

export type DurationMinutes = (typeof DURATION_PRESETS_MINUTES)[number];

export const DEFAULT_DURATION_MINUTES: DurationMinutes = 0.1;

export function isDurationPreset(value: unknown): value is DurationMinutes {
  return (DURATION_PRESETS_MINUTES as readonly number[]).includes(
    value as number,
  );
}

// Picker labels use seconds below a minute and natural units from a minute up.
export function formatDurationLabel(minutes: number): string {
  const language = getInitialLanguage();
  const t = createTranslator(language);
  const unit = (value: number, singular: string, plural: string) =>
    `${formatNumber(value, language)} ${pluralCategory(value, language) === "one" ? t(singular) : t(plural)}`;
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return unit(seconds, "sec", "secs");
  }

  if (minutes < 60) {
    return unit(minutes, "min", "mins");
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = unit(hours, "hr", "hrs");

  return rest === 0 ? hourLabel : `${hourLabel} ${unit(rest, "min", "mins")}`;
}

// Countdown display: "m:ss" under an hour, "h:mm:ss" from an hour up.
export function formatClock(totalSeconds: number): string {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes < 10 ? "0" : ""}${minutes}:${pad(seconds)}`;
}
