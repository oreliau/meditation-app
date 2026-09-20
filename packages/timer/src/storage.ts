import { isStorageAvailable } from "@meditation-app/storage";
import { createMMKV } from "react-native-mmkv";
import { type DurationMinutes, isDurationPreset } from "./durations";
import type { Session } from "./session";
import type { ProgramContext } from "./sessionStore";

// Holds the live session, chosen preset, and optional Program session context;
// it still stores no per-session history (ADR-0004).
export const AURA_TIMER_STORAGE_ID = "aura-timer";
export const timerStorage = createMMKV({ id: AURA_TIMER_STORAGE_ID });

export const DURATION_MINUTES_KEY = "durationMinutes";
export const SESSION_KEY = "session";
export const PROGRAM_CONTEXT_KEY = "programContext";
export const NOTIFICATION_PREFERENCE_KEY = "notificationPreference";
export const VOLUME_PREFERENCE_KEY = "volumePreference";

export function getPersistedProgramContext(): ProgramContext | undefined {
  if (!isStorageAvailable()) return undefined;
  const raw = timerStorage.getString(PROGRAM_CONTEXT_KEY);
  if (!raw) return undefined;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      typeof (value as Record<string, unknown>).programId === "string" &&
      typeof (value as Record<string, unknown>).sessionId === "string"
    ) {
      return value as ProgramContext;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function persistProgramContext(
  context: ProgramContext | undefined,
): void {
  if (!isStorageAvailable()) return;
  if (context) timerStorage.set(PROGRAM_CONTEXT_KEY, JSON.stringify(context));
  else timerStorage.remove(PROGRAM_CONTEXT_KEY);
}

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

export function getPersistedVolumePreference(): boolean | undefined {
  if (!isStorageAvailable()) {
    return undefined;
  }

  const value = timerStorage.getBoolean(VOLUME_PREFERENCE_KEY);

  return typeof value === "boolean" ? value : undefined;
}

export function persistVolumePreference(enabled: boolean): void {
  if (isStorageAvailable()) {
    timerStorage.set(VOLUME_PREFERENCE_KEY, enabled);
  }
}
