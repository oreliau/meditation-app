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

// Picker labels: "{n} min" under an hour, compact "1h" / "1h30" / "2h" above.
export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest === 0 ? `${hours}h` : `${hours}h${rest}`;
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
