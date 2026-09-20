import { createMMKV } from "react-native-mmkv";

// Daily stats: how many Sessions completed today and for how long in
// total, keyed by device-local calendar day. Only the current day's
// aggregate is kept (older keys are pruned on write) — this feeds the
// evening summary, it is not a history. Same MMKV shape as
// src/theme/storage.ts.
export const statsStorage = createMMKV({ id: "aura-stats" });

export type DailyStats = {
  sessionCount: number;
  totalDurationSeconds: number;
};

const EMPTY: DailyStats = { sessionCount: 0, totalDurationSeconds: 0 };

const DAILY_KEY_PREFIX = "daily:";

// "YYYY-MM-DD" in the device's local timezone (Date's local getters), so
// the day flips at the user's midnight, not UTC's.
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function storageKey(date: Date): string {
  return `${DAILY_KEY_PREFIX}${dayKey(date)}`;
}

function parseStats(raw: string | undefined): DailyStats {
  if (raw === undefined) {
    return EMPTY;
  }
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) {
      return EMPTY;
    }
    const { sessionCount, totalDurationSeconds } = data as Record<
      string,
      unknown
    >;
    if (
      typeof sessionCount !== "number" ||
      typeof totalDurationSeconds !== "number"
    ) {
      return EMPTY;
    }
    return { sessionCount, totalDurationSeconds };
  } catch {
    return EMPTY;
  }
}

export function getDailyStats(date: Date = new Date()): DailyStats {
  return parseStats(statsStorage.getString(storageKey(date)));
}

// The session timer's hook: call once per natural completion (never on
// Stop). `now` is injectable for tests; production callers omit it.
export function recordSessionCompleted(
  durationSeconds: number,
  now: Date = new Date(),
): void {
  const key = storageKey(now);
  const current = parseStats(statsStorage.getString(key));
  const next: DailyStats = {
    sessionCount: current.sessionCount + 1,
    totalDurationSeconds: current.totalDurationSeconds + durationSeconds,
  };
  for (const stale of statsStorage.getAllKeys()) {
    if (stale.startsWith(DAILY_KEY_PREFIX) && stale !== key) {
      statsStorage.remove(stale);
    }
  }
  statsStorage.set(key, JSON.stringify(next));
}
