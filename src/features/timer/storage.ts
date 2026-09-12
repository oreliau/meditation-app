import { createMMKV } from "react-native-mmkv";
import { isStorageAvailable } from "@/storage/isStorageAvailable";
import { type DurationMinutes, isDurationPreset } from "./durations";
import type { Session } from "./session";

// Holds the live session and the chosen preset only — no history (ADR-0004).
export const timerStorage = createMMKV({ id: "aura-timer" });

export const DURATION_MINUTES_KEY = "durationMinutes";
export const SESSION_KEY = "session";

export function getPersistedDurationMinutes(): DurationMinutes | undefined {
  if (!isStorageAvailable()) {
    return undefined;
  }

  const value = timerStorage.getNumber(DURATION_MINUTES_KEY);

  return isDurationPreset(value) ? value : undefined;
}

export function persistDurationMinutes(minutes: DurationMinutes): void {
  if (isStorageAvailable()) {
    timerStorage.set(DURATION_MINUTES_KEY, minutes);
  }
}

export function getPersistedSession(): Session | undefined {
  if (!isStorageAvailable()) {
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
  if (isStorageAvailable()) {
    timerStorage.set(SESSION_KEY, JSON.stringify(session));
  }
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
