import { createMMKV } from "react-native-mmkv";
import { type DurationMinutes, isDurationPreset } from "./durations";
import type { Session } from "./session";

export const timerStorage = createMMKV({ id: "aura-timer" });

export const DURATION_MINUTES_KEY = "durationMinutes";
export const SESSION_KEY = "session";

// Same web-SSR guard as src/theme/storage.ts: MMKV's web backend touches
// `window.localStorage` lazily and throws when Expo Router prerenders
// without a DOM. The client bundle re-reads normally.
function canReadStorage(): boolean {
  return typeof window !== "undefined";
}

export function getPersistedDurationMinutes(): DurationMinutes | undefined {
  if (!canReadStorage()) {
    return undefined;
  }

  const value = timerStorage.getNumber(DURATION_MINUTES_KEY);

  return isDurationPreset(value) ? value : undefined;
}

export function persistDurationMinutes(minutes: DurationMinutes): void {
  timerStorage.set(DURATION_MINUTES_KEY, minutes);
}

export function getPersistedSession(): Session | undefined {
  if (!canReadStorage()) {
    return undefined;
  }

  const raw = timerStorage.getString(SESSION_KEY);

  if (raw === undefined) {
    return undefined;
  }

  try {
    return parseSession(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

export function persistSession(session: Session): void {
  timerStorage.set(SESSION_KEY, JSON.stringify(session));
}

// Defensive decode: the stored blob is our own JSON, but a shape mismatch
// after a future refactor should fall back to Idle rather than crash.
function parseSession(value: unknown): Session | undefined {
  if (typeof value !== "object" || value === null || !("status" in value)) {
    return undefined;
  }

  const candidate = value as { status: unknown; [key: string]: unknown };

  switch (candidate.status) {
    case "Idle":
    case "Stopped":
    case "Completed":
      return { status: candidate.status };
    case "Running":
      return typeof candidate.endsAt === "number"
        ? { status: "Running", endsAt: candidate.endsAt }
        : undefined;
    case "Paused":
      return typeof candidate.remainingMs === "number"
        ? { status: "Paused", remainingMs: candidate.remainingMs }
        : undefined;
    default:
      return undefined;
  }
}
