import {
  dayKey,
  getDailyStats,
  recordSessionCompleted,
  statsStorage,
} from "../dailyStats";

beforeEach(() => {
  statsStorage.clearAll();
});

describe("dayKey", () => {
  it("keys by device-local calendar day, zero-padded", () => {
    expect(dayKey(new Date(2026, 0, 5, 9, 30))).toBe("2026-01-05");
    expect(dayKey(new Date(2026, 11, 25, 23, 59, 59))).toBe("2026-12-25");
  });
});

describe("daily stats", () => {
  const day1Morning = new Date(2026, 8, 12, 8, 0);
  const day1Night = new Date(2026, 8, 12, 23, 59, 59);
  const day2 = new Date(2026, 8, 13, 0, 0, 0);

  it("reads as no activity before any session completed", () => {
    expect(getDailyStats(day1Morning)).toEqual({
      sessionCount: 0,
      totalDurationSeconds: 0,
    });
  });

  it("counts completed sessions and sums their durations for the day", () => {
    recordSessionCompleted(600, day1Morning);
    recordSessionCompleted(120, day1Night);
    expect(getDailyStats(day1Night)).toEqual({
      sessionCount: 2,
      totalDurationSeconds: 720,
    });
  });

  it("rolls over at local midnight: yesterday's sessions don't count today", () => {
    recordSessionCompleted(600, day1Night);
    expect(getDailyStats(day2)).toEqual({
      sessionCount: 0,
      totalDurationSeconds: 0,
    });
    recordSessionCompleted(300, day2);
    expect(getDailyStats(day2)).toEqual({
      sessionCount: 1,
      totalDurationSeconds: 300,
    });
  });

  it("keeps only the current day's aggregate, not a growing history", () => {
    recordSessionCompleted(600, day1Morning);
    recordSessionCompleted(300, day2);
    expect(statsStorage.contains(`daily:${dayKey(day1Morning)}`)).toBe(false);
    expect(statsStorage.contains(`daily:${dayKey(day2)}`)).toBe(true);
  });

  it("ignores a corrupt stored value", () => {
    statsStorage.set(`daily:${dayKey(day1Morning)}`, "nope");
    expect(getDailyStats(day1Morning)).toEqual({
      sessionCount: 0,
      totalDurationSeconds: 0,
    });
    recordSessionCompleted(60, day1Morning);
    expect(getDailyStats(day1Morning)).toEqual({
      sessionCount: 1,
      totalDurationSeconds: 60,
    });
  });
});
