import { act, renderHook } from "@testing-library/react";
import {
  getSessionStore,
  SESSION_END_ALERT_ID,
  sessionEndAlertStorage,
  setSessionEndAlertEnabled,
} from "@/features/timer";
import { setNotificationsClient } from "@/reminders";
import { createFakeNotificationsClient } from "@/test/fakeNotificationsClient";
import { useSessionEndAlertSetting } from "../useSessionEndAlertSetting";

let fake: ReturnType<typeof createFakeNotificationsClient>;

beforeEach(() => {
  sessionEndAlertStorage.clearAll();
  fake = createFakeNotificationsClient();
  setNotificationsClient(fake.client);
});

describe("Session-end alert toggle", () => {
  it("is off until turned on, and remembers being on", () => {
    const first = renderHook(() => useSessionEndAlertSetting());
    expect(first.result.current.enabled).toBe(false);

    setSessionEndAlertEnabled(true);
    const second = renderHook(() => useSessionEndAlertSetting());
    expect(second.result.current.enabled).toBe(true);
  });

  it("asks for permission just-in-time and proceeds when granted", async () => {
    fake.answerRequestsWith("granted");
    const { result } = renderHook(() => useSessionEndAlertSetting());

    await act(() => result.current.setEnabled(true));

    expect(fake.requests).toHaveLength(1);
    expect(result.current.enabled).toBe(true);
    expect(result.current.permissionDenied).toBe(false);
    // No session running, so nothing is armed yet.
    expect(fake.scheduledOnce.size).toBe(0);
  });

  it("leaves the toggle off and surfaces the denied prompt when permission is refused", async () => {
    fake.answerRequestsWith("denied");
    const { result } = renderHook(() => useSessionEndAlertSetting());

    await act(() => result.current.setEnabled(true));

    expect(result.current.enabled).toBe(false);
    expect(result.current.permissionDenied).toBe(true);
    expect(
      renderHook(() => useSessionEndAlertSetting()).result.current.enabled,
    ).toBe(false);
  });

  it("does not re-prompt the OS once permission has been denied, but still shows the prompt", async () => {
    fake.setPermission("denied");
    const { result } = renderHook(() => useSessionEndAlertSetting());

    await act(() => result.current.setEnabled(true));

    expect(fake.requests).toHaveLength(0);
    expect(result.current.permissionDenied).toBe(true);
  });

  it("arms the alert immediately if a session is already Running when turned on, and disarms when turned off", async () => {
    fake.setPermission("granted");
    const store = getSessionStore();
    store.play();
    const endsAt = store.getSnapshot().endsAt;

    const { result } = renderHook(() => useSessionEndAlertSetting());
    await act(() => result.current.setEnabled(true));

    expect(fake.scheduledOnce.get(SESSION_END_ALERT_ID)).toMatchObject({
      date: endsAt,
    });

    await act(() => result.current.setEnabled(false));

    expect(fake.scheduledOnce.size).toBe(0);

    store.stop();
  });
});
