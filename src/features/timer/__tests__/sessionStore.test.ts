import { AppState, type AppStateStatus } from "react-native";
import { createSessionStore } from "../sessionStore";
import { DURATION_MINUTES_KEY, SESSION_KEY, timerStorage } from "../storage";

const T0 = 1_700_000_000_000;

const mockStorage = timerStorage as jest.Mocked<typeof timerStorage>;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(T0);
  mockStorage.getString.mockReset();
  mockStorage.getNumber.mockReset();
  mockStorage.set.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("createSessionStore", () => {
  it("starts Idle at the default 12 min preset with the full duration remaining", () => {
    const store = createSessionStore();
    const snapshot = store.getSnapshot();

    expect(snapshot.status).toBe("Idle");
    expect(snapshot.durationMinutes).toBe(12);
    expect(snapshot.remainingSeconds).toBe(12 * 60);
    expect(snapshot.canChangeDuration).toBe(true);
    expect(snapshot.isActive).toBe(false);
  });

  it("counts down from the wall clock once Running", () => {
    const store = createSessionStore();

    store.play();
    expect(store.getSnapshot().status).toBe("Running");
    expect(store.getSnapshot().isActive).toBe(true);
    expect(store.getSnapshot().canChangeDuration).toBe(false);

    jest.advanceTimersByTime(1_000);
    expect(store.getSnapshot().remainingSeconds).toBe(12 * 60 - 1);

    // A long jump (e.g. returning from the background) is reflected exactly,
    // not one tick's worth.
    jest.advanceTimersByTime(5 * 60 * 1_000);
    expect(store.getSnapshot().remainingSeconds).toBe(7 * 60 - 1);
    expect(store.getSnapshot().progress).toBeCloseTo((5 * 60 + 1) / (12 * 60));
  });

  it("notifies subscribers on every visible change and returns a stable snapshot otherwise", () => {
    const store = createSessionStore();
    const listener = jest.fn();
    store.subscribe(listener);

    const before = store.getSnapshot();
    expect(store.getSnapshot()).toBe(before);

    store.play();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).not.toBe(before);

    // Sub-second ticks that don't change the displayed second are silent.
    const afterPlay = store.getSnapshot();
    jest.advanceTimersByTime(250);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe(afterPlay);

    jest.advanceTimersByTime(1_000);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("re-syncs from the wall clock the moment the app returns to the foreground", () => {
    // jest-expo mocks AppState; capture the listener the store registers so
    // the test can play the OS: timers stall while backgrounded, then "active".
    const listeners: ((state: AppStateStatus) => void)[] = [];
    const addEventListener = AppState.addEventListener as jest.Mock;
    addEventListener.mockImplementationOnce((_type, listener) => {
      listeners.push(listener);
      return { remove: jest.fn() };
    });
    const onCompleted = jest.fn();
    const store = createSessionStore();
    store.subscribeToCompletion(onCompleted);

    store.play();
    // Wall clock advances 2 min without any timer firing (backgrounded).
    jest.setSystemTime(T0 + 2 * 60 * 1_000);
    expect(store.getSnapshot().remainingSeconds).toBe(12 * 60);

    for (const listener of listeners) listener("active");
    expect(store.getSnapshot().remainingSeconds).toBe(10 * 60);

    // Expiring while suspended completes (with feedback) on return.
    jest.setSystemTime(T0 + 13 * 60 * 1_000);
    for (const listener of listeners) listener("active");
    expect(store.getSnapshot().status).toBe("Completed");
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("fires completion listeners exactly once when the session reaches 0 on its own", () => {
    const onCompleted = jest.fn();
    const store = createSessionStore();
    store.subscribeToCompletion(onCompleted);

    store.play();
    jest.advanceTimersByTime(12 * 60 * 1_000 - 1);
    expect(store.getSnapshot().status).toBe("Running");
    expect(onCompleted).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1_000);
    expect(store.getSnapshot().status).toBe("Completed");
    expect(store.getSnapshot().remainingSeconds).toBe(0);
    expect(onCompleted).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(10_000);
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("preserves an active Session when the Timer tab screen unmounts", () => {
    const onCompleted = jest.fn();
    const store = createSessionStore();
    const unsubscribe = store.subscribe(jest.fn());
    store.subscribeToCompletion(onCompleted);

    store.play();
    unsubscribe();
    jest.advanceTimersByTime(12 * 60 * 1_000);

    expect(store.getSnapshot().status).toBe("Completed");
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("Stop ends the session quietly: remaining 0, Stopped, no completion", () => {
    const onCompleted = jest.fn();
    const store = createSessionStore();
    store.subscribeToCompletion(onCompleted);

    store.play();
    jest.advanceTimersByTime(30_000);
    store.stop();

    expect(store.getSnapshot().status).toBe("Stopped");
    expect(store.getSnapshot().remainingSeconds).toBe(0);
    expect(store.getSnapshot().canChangeDuration).toBe(true);

    jest.advanceTimersByTime(20 * 60 * 1_000);
    expect(onCompleted).not.toHaveBeenCalled();
  });

  it("Pause freezes the countdown; Play resumes it; Restart begins afresh", () => {
    const store = createSessionStore();

    store.play();
    jest.advanceTimersByTime(30_000);
    store.pause();
    expect(store.getSnapshot().status).toBe("Paused");

    jest.advanceTimersByTime(60_000);
    expect(store.getSnapshot().remainingSeconds).toBe(12 * 60 - 30);

    store.play();
    jest.advanceTimersByTime(10_000);
    expect(store.getSnapshot().status).toBe("Running");
    expect(store.getSnapshot().remainingSeconds).toBe(12 * 60 - 40);

    store.restart();
    expect(store.getSnapshot().status).toBe("Running");
    expect(store.getSnapshot().remainingSeconds).toBe(12 * 60);
  });

  it("resetToIdle ends a Completed session and returns to Idle without starting a new one", () => {
    const store = createSessionStore();

    store.play();
    jest.advanceTimersByTime(12 * 60 * 1_000);
    expect(store.getSnapshot().status).toBe("Completed");

    store.resetToIdle();
    expect(store.getSnapshot().status).toBe("Idle");
    expect(store.getSnapshot().remainingSeconds).toBe(12 * 60);
    expect(store.getSnapshot().canChangeDuration).toBe(true);
  });

  describe("persistence", () => {
    it("remembers the last-selected duration preset across relaunch", () => {
      mockStorage.getNumber.mockReturnValue(20);
      const store = createSessionStore();

      expect(store.getSnapshot().durationMinutes).toBe(20);
      expect(store.getSnapshot().remainingSeconds).toBe(20 * 60);
    });

    it("persists a newly selected preset and updates the idle display", () => {
      const store = createSessionStore();

      store.setDurationMinutes(45);

      expect(store.getSnapshot().durationMinutes).toBe(45);
      expect(store.getSnapshot().remainingSeconds).toBe(45 * 60);
      expect(mockStorage.set).toHaveBeenCalledWith(DURATION_MINUTES_KEY, 45);
    });

    it("ignores duration changes while Running or Paused", () => {
      const store = createSessionStore();

      store.play();
      store.setDurationMinutes(45);
      expect(store.getSnapshot().durationMinutes).toBe(12);

      store.pause();
      store.setDurationMinutes(45);
      expect(store.getSnapshot().durationMinutes).toBe(12);
    });

    it("resumes a persisted Running session with time recomputed from the wall clock", () => {
      mockStorage.getString.mockReturnValue(
        JSON.stringify({ status: "Running", endsAt: T0 + 5 * 60 * 1_000 }),
      );
      const onCompleted = jest.fn();
      const store = createSessionStore();
      store.subscribeToCompletion(onCompleted);

      expect(store.getSnapshot().status).toBe("Running");
      expect(store.getSnapshot().remainingSeconds).toBe(5 * 60);

      jest.advanceTimersByTime(5 * 60 * 1_000);
      expect(store.getSnapshot().status).toBe("Completed");
      expect(onCompleted).toHaveBeenCalledTimes(1);
    });

    it("shows a session that expired while the app was killed as Completed, with no feedback, and writes it back", () => {
      mockStorage.getString.mockReturnValue(
        JSON.stringify({ status: "Running", endsAt: T0 - 1_000 }),
      );
      const onCompleted = jest.fn();
      const store = createSessionStore();
      store.subscribeToCompletion(onCompleted);

      expect(store.getSnapshot().status).toBe("Completed");
      expect(store.getSnapshot().remainingSeconds).toBe(0);
      expect(mockStorage.set).toHaveBeenCalledWith(
        SESSION_KEY,
        JSON.stringify({ status: "Completed" }),
      );

      jest.advanceTimersByTime(10_000);
      expect(onCompleted).not.toHaveBeenCalled();
    });

    it("writes every session transition so a force-quit can be recovered", () => {
      const store = createSessionStore();

      store.play();
      expect(mockStorage.set).toHaveBeenLastCalledWith(
        SESSION_KEY,
        JSON.stringify({ status: "Running", endsAt: T0 + 12 * 60 * 1_000 }),
      );

      store.stop();
      expect(mockStorage.set).toHaveBeenLastCalledWith(
        SESSION_KEY,
        JSON.stringify({ status: "Stopped" }),
      );
    });

    it("falls back to Idle when the stored session is unreadable", () => {
      mockStorage.getString.mockReturnValue("{not json");
      const store = createSessionStore();

      expect(store.getSnapshot().status).toBe("Idle");
    });
  });
});
