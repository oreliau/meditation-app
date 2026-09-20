import { setNotificationsClient } from "@meditation-app/notifications";
import { createFakeNotificationsClient } from "@/test/fakeNotificationsClient";
import { SESSION_END_ALERT_ID, syncSessionEndAlert } from "../sessionEndAlert";
import {
  sessionEndAlertStorage,
  setSessionEndAlertEnabled,
} from "../sessionEndAlertStorage";
import type { SessionSnapshot } from "../sessionStore";

let fake: ReturnType<typeof createFakeNotificationsClient>;

beforeEach(() => {
  sessionEndAlertStorage.clearAll();
  fake = createFakeNotificationsClient();
  setNotificationsClient(fake.client);
});

function snapshot(overrides: Partial<SessionSnapshot>): SessionSnapshot {
  return {
    status: "Idle",
    isActive: false,
    remainingSeconds: 12 * 60,
    progress: 0,
    elapsedMs: 0,
    durationMinutes: 12,
    canChangeDuration: true,
    ...overrides,
  };
}

const running = (endsAt: number) =>
  snapshot({ status: "Running", isActive: true, endsAt });

describe("syncSessionEndAlert", () => {
  it("schedules nothing for a Running session while the setting is off", async () => {
    await syncSessionEndAlert(running(1_000));

    expect(fake.scheduledOnce.size).toBe(0);
  });

  it("schedules a one-time notification for endsAt when Running and enabled", async () => {
    setSessionEndAlertEnabled(true);

    await syncSessionEndAlert(running(5_000));

    expect(fake.scheduledOnce.get(SESSION_END_ALERT_ID)).toMatchObject({
      date: 5_000,
      title: "Session complete",
      body: "Your practice is done. Come back whenever you're ready.",
    });
  });

  it("reschedules when endsAt moves, e.g. resume-from-pause or restart", async () => {
    setSessionEndAlertEnabled(true);

    await syncSessionEndAlert(running(5_000));
    await syncSessionEndAlert(running(9_000));

    expect(fake.scheduledOnce.get(SESSION_END_ALERT_ID)?.date).toBe(9_000);
  });

  it("does not re-issue the schedule call for repeated snapshots of the same endsAt", async () => {
    setSessionEndAlertEnabled(true);
    const scheduleAt = jest.spyOn(fake.client, "scheduleAt");

    await syncSessionEndAlert(running(5_000));
    await syncSessionEndAlert(running(5_000));
    await syncSessionEndAlert(running(5_000));

    expect(scheduleAt).toHaveBeenCalledTimes(1);
  });

  it("cancels when the session is Paused", async () => {
    setSessionEndAlertEnabled(true);
    await syncSessionEndAlert(running(5_000));

    await syncSessionEndAlert(
      snapshot({ status: "Paused", isActive: true, remainingSeconds: 300 }),
    );

    expect(fake.scheduledOnce.size).toBe(0);
  });

  it("cancels when the session is Stopped", async () => {
    setSessionEndAlertEnabled(true);
    await syncSessionEndAlert(running(5_000));

    await syncSessionEndAlert(snapshot({ status: "Stopped" }));

    expect(fake.scheduledOnce.size).toBe(0);
  });

  it("cancels on Completed, suppressing a redundant notification when the session finished in the foreground", async () => {
    setSessionEndAlertEnabled(true);
    await syncSessionEndAlert(running(5_000));

    await syncSessionEndAlert(
      snapshot({ status: "Completed", remainingSeconds: 0, progress: 1 }),
    );

    expect(fake.scheduledOnce.size).toBe(0);
  });

  it("cancels an armed alert if the setting is turned off", async () => {
    setSessionEndAlertEnabled(true);
    await syncSessionEndAlert(running(5_000));
    expect(fake.scheduledOnce.size).toBe(1);

    setSessionEndAlertEnabled(false);
    await syncSessionEndAlert(running(5_000));

    expect(fake.scheduledOnce.size).toBe(0);
  });

  it("does not let a pending schedule recreate an alert after foreground completion", async () => {
    setSessionEndAlertEnabled(true);
    let releaseSchedule!: () => void;
    const schedulePending = new Promise<void>((resolve) => {
      releaseSchedule = resolve;
    });
    jest
      .spyOn(fake.client, "scheduleAt")
      .mockImplementation(async (notification) => {
        await schedulePending;
        fake.scheduledOnce.set(notification.id, notification);
      });

    const arm = syncSessionEndAlert(running(5_000));
    const complete = syncSessionEndAlert(
      snapshot({ status: "Completed", remainingSeconds: 0, progress: 1 }),
    );

    releaseSchedule();
    await Promise.all([arm, complete]);

    expect(fake.scheduledOnce.size).toBe(0);
  });
});
