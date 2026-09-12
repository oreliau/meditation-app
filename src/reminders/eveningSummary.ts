import type { DailyStats } from "@/stats/dailyStats";

export type NotificationContent = { title: string; body: string };

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

// Composes the 18:00 message from today's Daily stats. Written in the same
// voice as the morning presence sentences: reflective when the user
// practised, a gentle nudge when they didn't — but always something, the
// evening notification is never skipped.
export function composeEveningSummary(stats: DailyStats): NotificationContent {
  const title = "Evening summary";
  if (stats.sessionCount === 0) {
    return {
      title,
      body: "The day isn't over yet. A few quiet breaths before bed still count.",
    };
  }
  const minutes = Math.max(1, Math.round(stats.totalDurationSeconds / 60));
  return {
    title,
    body: `You showed up for yourself today — ${plural(minutes, "minute")}, ${plural(stats.sessionCount, "session")}. Let that settle in.`,
  };
}
