import { act, renderHook } from "@testing-library/react";
import { setDailyStatsReader } from "../eveningReminder";
import { setNotificationsClient } from "../NotificationsClient";
import { PRESENCE_SENTENCES } from "../presenceSentences";
import { refreshReminders } from "../refreshReminders";
import { remindersStorage, setReminderEnabled } from "../storage";
import { useReminderSettings } from "../useReminderSettings";
import { createFakeNotificationsClient } from "./fakeNotificationsClient";

let fake: ReturnType<typeof createFakeNotificationsClient>;
let dailyStats = { sessionCount: 0, totalDurationSeconds: 0 };

beforeEach(() => {
  remindersStorage.clearAll();
  dailyStats = { sessionCount: 0, totalDurationSeconds: 0 };
  fake = createFakeNotificationsClient();
  setDailyStatsReader(() => dailyStats);
  setNotificationsClient(fake.client);
});

const sentences: readonly string[] = PRESENCE_SENTENCES;

describe("Morning presence reminder toggle", () => {
  it("is off until turned on, and remembers being on", () => {
    const first = renderHook(() => useReminderSettings());
    expect(first.result.current.morningEnabled).toBe(false);

    setReminderEnabled("morning", true);
    const second = renderHook(() => useReminderSettings());
    expect(second.result.current.morningEnabled).toBe(true);
  });

  it("schedules a daily 8:00 notification with a presence sentence when turned on with permission already granted", async () => {
    fake.setPermission("granted");
    const { result } = renderHook(() => useReminderSettings());

    await act(() => result.current.setMorningEnabled(true));

    expect(result.current.morningEnabled).toBe(true);
    expect(fake.requests).toHaveLength(0);
    const morning = fake.scheduled.get("morning-presence");
    expect(morning).toMatchObject({ hour: 8, minute: 0 });
    expect(sentences).toContain(morning?.body);
    // Persisted, so a fresh mount sees it on.
    expect(
      renderHook(() => useReminderSettings()).result.current.morningEnabled,
    ).toBe(true);
  });

  it("asks for permission just-in-time and proceeds when granted", async () => {
    fake.answerRequestsWith("granted");
    const { result } = renderHook(() => useReminderSettings());

    await act(() => result.current.setMorningEnabled(true));

    expect(fake.requests).toHaveLength(1);
    expect(result.current.morningEnabled).toBe(true);
    expect(result.current.permissionDenied).toBe(false);
    expect(fake.scheduled.has("morning-presence")).toBe(true);
  });

  it("leaves the toggle off and surfaces the denied prompt when permission is refused", async () => {
    fake.answerRequestsWith("denied");
    const { result } = renderHook(() => useReminderSettings());

    await act(() => result.current.setMorningEnabled(true));

    expect(result.current.morningEnabled).toBe(false);
    expect(result.current.permissionDenied).toBe(true);
    expect(fake.scheduled.size).toBe(0);
    expect(
      renderHook(() => useReminderSettings()).result.current.morningEnabled,
    ).toBe(false);
  });

  it("does not re-prompt the OS once permission has been denied, but still shows the prompt", async () => {
    fake.setPermission("denied");
    const { result } = renderHook(() => useReminderSettings());

    await act(() => result.current.setMorningEnabled(true));

    expect(fake.requests).toHaveLength(0);
    expect(result.current.permissionDenied).toBe(true);
  });

  it("cancels the scheduled notification when turned off", async () => {
    fake.setPermission("granted");
    const { result } = renderHook(() => useReminderSettings());
    await act(() => result.current.setMorningEnabled(true));
    expect(fake.scheduled.has("morning-presence")).toBe(true);

    await act(() => result.current.setMorningEnabled(false));

    expect(result.current.morningEnabled).toBe(false);
    expect(fake.scheduled.has("morning-presence")).toBe(false);
    expect(
      renderHook(() => useReminderSettings()).result.current.morningEnabled,
    ).toBe(false);
  });
});

describe("refreshReminders (on app foreground)", () => {
  it("moves the morning sentence on each day, never repeating yesterday's, however often the app is foregrounded", async () => {
    fake.setPermission("granted");
    jest.useFakeTimers({ now: new Date(2026, 8, 12, 7, 0) });
    try {
      const { result } = renderHook(() => useReminderSettings());
      await act(() => result.current.setMorningEnabled(true));
      const morning = () => fake.scheduled.get("morning-presence")?.body ?? "";

      const day1 = morning();
      expect(sentences).toContain(day1);

      // Foregrounding again before 8:00 keeps the same sentence for today.
      jest.setSystemTime(new Date(2026, 8, 12, 7, 30));
      await refreshReminders();
      expect(morning()).toBe(day1);

      // After 8:00 the pending content is for tomorrow — and different —
      // and stays put across any number of refreshes today.
      jest.setSystemTime(new Date(2026, 8, 12, 12, 0));
      await refreshReminders();
      const day2 = morning();
      expect(day2).not.toBe(day1);
      jest.setSystemTime(new Date(2026, 8, 12, 22, 0));
      await refreshReminders();
      expect(morning()).toBe(day2);

      jest.setSystemTime(new Date(2026, 8, 13, 9, 0));
      await refreshReminders();
      expect(morning()).not.toBe(day2);
      expect(fake.scheduled.get("morning-presence")).toMatchObject({
        hour: 8,
        minute: 0,
      });
    } finally {
      jest.useRealTimers();
    }
  });

  it("schedules nothing while the reminder is off", async () => {
    await refreshReminders();
    expect(fake.scheduled.size).toBe(0);
  });
});

describe("Evening summary toggle", () => {
  it("is off by default and schedules a daily 18:00 summary when turned on", async () => {
    fake.setPermission("granted");
    const { result } = renderHook(() => useReminderSettings());
    expect(result.current.eveningEnabled).toBe(false);

    await act(() => result.current.setEveningEnabled(true));

    expect(result.current.eveningEnabled).toBe(true);
    expect(fake.scheduled.get("evening-summary")).toMatchObject({
      hour: 18,
      minute: 0,
      title: "Evening summary",
    });
    expect(
      renderHook(() => useReminderSettings()).result.current.eveningEnabled,
    ).toBe(true);
  });

  it("reuses the just-in-time permission flow, including the denied prompt", async () => {
    fake.answerRequestsWith("denied");
    const { result } = renderHook(() => useReminderSettings());

    await act(() => result.current.setEveningEnabled(true));

    expect(fake.requests).toHaveLength(1);
    expect(result.current.eveningEnabled).toBe(false);
    expect(result.current.permissionDenied).toBe(true);
    expect(fake.scheduled.size).toBe(0);
  });

  it("composes the message from today's Daily stats at foreground time", async () => {
    fake.setPermission("granted");
    const { result } = renderHook(() => useReminderSettings());
    await act(() => result.current.setEveningEnabled(true));
    expect(fake.scheduled.get("evening-summary")?.body).toBe(
      "The day isn't over yet. A few quiet breaths before bed still count.",
    );

    dailyStats = { sessionCount: 2, totalDurationSeconds: 900 };
    await refreshReminders();

    expect(fake.scheduled.get("evening-summary")?.body).toBe(
      "You showed up for yourself today — 15 minutes, 2 sessions. Let that settle in.",
    );
  });

  it("cancels only the evening notification when turned off", async () => {
    fake.setPermission("granted");
    const { result } = renderHook(() => useReminderSettings());
    await act(() => result.current.setMorningEnabled(true));
    await act(() => result.current.setEveningEnabled(true));

    await act(() => result.current.setEveningEnabled(false));

    expect(fake.scheduled.has("evening-summary")).toBe(false);
    expect(fake.scheduled.has("morning-presence")).toBe(true);
    expect(result.current.morningEnabled).toBe(true);
    expect(
      renderHook(() => useReminderSettings()).result.current.eveningEnabled,
    ).toBe(false);
  });
});
