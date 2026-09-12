import { act, renderHook } from "@testing-library/react";
import { AppState, type AppStateStatus } from "react-native";
import { timerStorage } from "../storage";
import { useTimerSession } from "../useTimerSession";

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

describe("useTimerSession", () => {
  it("starts Idle at the default 12 min preset with the full duration remaining", () => {
    const { result } = renderHook(() => useTimerSession());

    expect(result.current.status).toBe("Idle");
    expect(result.current.durationMinutes).toBe(12);
    expect(result.current.remainingSeconds).toBe(12 * 60);
    expect(result.current.canChangeDuration).toBe(true);
  });

  it("counts down from the wall clock once Running", () => {
    const { result } = renderHook(() => useTimerSession());

    act(() => {
      result.current.play();
    });
    expect(result.current.status).toBe("Running");
    expect(result.current.canChangeDuration).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.remainingSeconds).toBe(12 * 60 - 1);

    // A long jump (e.g. returning from the background) is reflected exactly,
    // not one tick's worth.
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1_000);
    });
    expect(result.current.remainingSeconds).toBe(7 * 60 - 1);
  });

  it("re-syncs from the wall clock the moment the app returns to the foreground", () => {
    // jest-expo mocks AppState; capture the listener the hook registers so the
    // test can play the OS: timers stall while backgrounded, then "active".
    const listeners: Array<(state: AppStateStatus) => void> = [];
    const addEventListener = AppState.addEventListener as jest.Mock;
    addEventListener.mockImplementationOnce((_type, listener) => {
      listeners.push(listener);
      return { remove: jest.fn() };
    });
    const onCompleted = jest.fn();
    const { result } = renderHook(() => useTimerSession({ onCompleted }));

    act(() => {
      result.current.play();
    });
    // Wall clock advances 2 min without any timer firing (backgrounded).
    jest.setSystemTime(T0 + 2 * 60 * 1_000);
    expect(result.current.remainingSeconds).toBe(12 * 60);

    act(() => {
      for (const listener of listeners) listener("active");
    });
    expect(result.current.remainingSeconds).toBe(10 * 60);

    // Expiring while suspended completes (with feedback) on return.
    jest.setSystemTime(T0 + 13 * 60 * 1_000);
    act(() => {
      for (const listener of listeners) listener("active");
    });
    expect(result.current.status).toBe("Completed");
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("fires onCompleted exactly once when the session reaches 0 on its own", () => {
    const onCompleted = jest.fn();
    const { result } = renderHook(() => useTimerSession({ onCompleted }));

    act(() => {
      result.current.play();
    });
    act(() => {
      jest.advanceTimersByTime(12 * 60 * 1_000 - 1);
    });
    expect(result.current.status).toBe("Running");
    expect(onCompleted).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.status).toBe("Completed");
    expect(result.current.remainingSeconds).toBe(0);
    expect(onCompleted).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(10_000);
    });
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("Stop ends the session quietly: remaining 0, Stopped, no onCompleted", () => {
    const onCompleted = jest.fn();
    const { result } = renderHook(() => useTimerSession({ onCompleted }));

    act(() => {
      result.current.play();
    });
    act(() => {
      jest.advanceTimersByTime(30_000);
    });
    act(() => {
      result.current.stop();
    });

    expect(result.current.status).toBe("Stopped");
    expect(result.current.remainingSeconds).toBe(0);
    expect(result.current.canChangeDuration).toBe(true);

    act(() => {
      jest.advanceTimersByTime(20 * 60 * 1_000);
    });
    expect(onCompleted).not.toHaveBeenCalled();
  });

  it("Pause freezes the countdown; Play resumes it; Restart begins afresh", () => {
    const { result } = renderHook(() => useTimerSession());

    act(() => {
      result.current.play();
    });
    act(() => {
      jest.advanceTimersByTime(30_000);
    });
    act(() => {
      result.current.pause();
    });
    expect(result.current.status).toBe("Paused");

    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(result.current.remainingSeconds).toBe(12 * 60 - 30);

    act(() => {
      result.current.play();
    });
    act(() => {
      jest.advanceTimersByTime(10_000);
    });
    expect(result.current.status).toBe("Running");
    expect(result.current.remainingSeconds).toBe(12 * 60 - 40);

    act(() => {
      result.current.restart();
    });
    expect(result.current.status).toBe("Running");
    expect(result.current.remainingSeconds).toBe(12 * 60);
  });

  describe("persistence", () => {
    it("remembers the last-selected duration preset across relaunch", () => {
      mockStorage.getNumber.mockReturnValue(20);
      const { result } = renderHook(() => useTimerSession());

      expect(result.current.durationMinutes).toBe(20);
      expect(result.current.remainingSeconds).toBe(20 * 60);
    });

    it("persists a newly selected preset and updates the idle display", () => {
      const { result } = renderHook(() => useTimerSession());

      act(() => {
        result.current.setDurationMinutes(45);
      });

      expect(result.current.durationMinutes).toBe(45);
      expect(result.current.remainingSeconds).toBe(45 * 60);
      expect(mockStorage.set).toHaveBeenCalledWith("durationMinutes", 45);
    });

    it("ignores duration changes while Running or Paused", () => {
      const { result } = renderHook(() => useTimerSession());

      act(() => {
        result.current.play();
      });
      act(() => {
        result.current.setDurationMinutes(45);
      });
      expect(result.current.durationMinutes).toBe(12);

      act(() => {
        result.current.pause();
      });
      act(() => {
        result.current.setDurationMinutes(45);
      });
      expect(result.current.durationMinutes).toBe(12);
    });

    it("resumes a persisted Running session with time recomputed from the wall clock", () => {
      mockStorage.getString.mockReturnValue(
        JSON.stringify({ status: "Running", endsAt: T0 + 5 * 60 * 1_000 }),
      );
      const onCompleted = jest.fn();
      const { result } = renderHook(() => useTimerSession({ onCompleted }));

      expect(result.current.status).toBe("Running");
      expect(result.current.remainingSeconds).toBe(5 * 60);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1_000);
      });
      expect(result.current.status).toBe("Completed");
      expect(onCompleted).toHaveBeenCalledTimes(1);
    });

    it("shows a session that expired while the app was killed as Completed, with no feedback", () => {
      mockStorage.getString.mockReturnValue(
        JSON.stringify({ status: "Running", endsAt: T0 - 1_000 }),
      );
      const onCompleted = jest.fn();
      const { result } = renderHook(() => useTimerSession({ onCompleted }));

      expect(result.current.status).toBe("Completed");
      expect(result.current.remainingSeconds).toBe(0);

      act(() => {
        jest.advanceTimersByTime(10_000);
      });
      expect(onCompleted).not.toHaveBeenCalled();
    });

    it("writes every session transition so a force-quit can be recovered", () => {
      const { result } = renderHook(() => useTimerSession());

      act(() => {
        result.current.play();
      });
      expect(mockStorage.set).toHaveBeenLastCalledWith(
        "session",
        JSON.stringify({ status: "Running", endsAt: T0 + 12 * 60 * 1_000 }),
      );

      act(() => {
        result.current.stop();
      });
      expect(mockStorage.set).toHaveBeenLastCalledWith(
        "session",
        JSON.stringify({ status: "Stopped" }),
      );
    });

    it("falls back to Idle when the stored session is unreadable", () => {
      mockStorage.getString.mockReturnValue("{not json");
      const { result } = renderHook(() => useTimerSession());

      expect(result.current.status).toBe("Idle");
    });
  });
});
