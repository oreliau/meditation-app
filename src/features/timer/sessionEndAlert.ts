import { createTranslator, getInitialLanguage } from "@/i18n";
import { getNotificationsClient } from "@/reminders/NotificationsClient";
import { isSessionEndAlertEnabled } from "./sessionEndAlertStorage";
import type { SessionSnapshot } from "./sessionStore";

export const SESSION_END_ALERT_ID = "session-end-alert";

// The endsAt this module currently has scheduled a notification for, if
// any — lets syncSessionEndAlert stay idempotent across repeated snapshots
// of the same Running session (it publishes roughly once a second).
let armedEndsAt: number | undefined;
let syncQueue = Promise.resolve();

// Keeps exactly one scheduled notification in sync with the session
// store's current snapshot: armed while Running (rescheduled whenever
// endsAt moves, e.g. resume-from-pause or restart-while-running),
// disarmed otherwise — Paused, Stopped, Completed, or the setting being
// off. Disarming on Completed is what suppresses a redundant system
// notification when the session finishes while the app is foregrounded,
// since that's the same commit() that drives the in-app haptic/chime.
async function syncSessionEndAlertNow(
  snapshot: SessionSnapshot,
): Promise<void> {
  const client = getNotificationsClient();

  if (
    !isSessionEndAlertEnabled() ||
    snapshot.status !== "Running" ||
    snapshot.endsAt === undefined
  ) {
    if (armedEndsAt !== undefined) {
      armedEndsAt = undefined;
      await client.cancel(SESSION_END_ALERT_ID);
    }
    return;
  }

  if (snapshot.endsAt !== armedEndsAt) {
    const t = createTranslator(getInitialLanguage());
    armedEndsAt = snapshot.endsAt;
    await client.scheduleAt({
      id: SESSION_END_ALERT_ID,
      date: snapshot.endsAt,
      title: t("sessionComplete"),
      body: t("sessionCompleteBody"),
      data: { kind: "session-end-alert" },
    });
  }
}

// Scheduling and cancellation share one queue so a foreground completion
// cannot cancel before an earlier asynchronous schedule has finished.
export function syncSessionEndAlert(snapshot: SessionSnapshot): Promise<void> {
  const next = syncQueue.then(() => syncSessionEndAlertNow(snapshot));
  syncQueue = next.catch(() => {});
  return next;
}
