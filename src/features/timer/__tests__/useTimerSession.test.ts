import { act, renderHook } from "@testing-library/react";
import { createSessionStore } from "../sessionStore";
import { useTimerSession } from "../useTimerSession";

const T0 = 1_700_000_000_000;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(T0);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useTimerSession", () => {
  it("renders the store's snapshot and re-renders as the session changes", () => {
    const store = createSessionStore();
    const { result } = renderHook(() => useTimerSession(store));

    expect(result.current.status).toBe("Idle");
    expect(result.current.remainingSeconds).toBe(12 * 60);

    act(() => {
      result.current.play();
    });
    expect(result.current.status).toBe("Running");

    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.remainingSeconds).toBe(12 * 60 - 1);
  });

  it("keeps reflecting a session that advanced while the hook was unmounted", () => {
    const store = createSessionStore();
    const first = renderHook(() => useTimerSession(store));

    act(() => {
      first.result.current.play();
    });
    first.unmount();

    act(() => {
      jest.advanceTimersByTime(30_000);
    });

    const second = renderHook(() => useTimerSession(store));
    expect(second.result.current.status).toBe("Running");
    expect(second.result.current.remainingSeconds).toBe(12 * 60 - 30);
  });
});
