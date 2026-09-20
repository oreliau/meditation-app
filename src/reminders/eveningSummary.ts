import {
  createTranslator,
  formatNumber,
  getInitialLanguage,
  pluralCategory,
} from "@/i18n";
import type { DailyStats } from "@/stats/dailyStats";

export type NotificationContent = { title: string; body: string };

// Composes the 18:00 message from today's Daily stats. Written in the same
// voice as the morning presence sentences: reflective when the user
// practised, a gentle nudge when they didn't — but always something, the
// evening notification is never skipped.
export function composeEveningSummary(stats: DailyStats): NotificationContent {
  const language = getInitialLanguage();
  const t = createTranslator(language);
  const title = t("eveningSummary");
  if (stats.sessionCount === 0) {
    return {
      title,
      body: t("dayNotOver"),
    };
  }
  const minutes = Math.max(1, Math.round(stats.totalDurationSeconds / 60));
  return {
    title,
    body: t("showedUp", {
      minutes: formatNumber(minutes, language),
      minute:
        pluralCategory(minutes, language) === "one"
          ? t("minute")
          : t("minutes"),
      sessions: formatNumber(stats.sessionCount, language),
      session:
        pluralCategory(stats.sessionCount, language) === "one"
          ? t("session")
          : t("sessions"),
    }),
  };
}
