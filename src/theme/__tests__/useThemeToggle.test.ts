import { renderHook, act } from "@testing-library/react";
import { useThemeToggle } from "../useThemeToggle";
import { setThemeRuntime } from "../ThemeRuntime";
import type { ThemeRuntime } from "../ThemeRuntime";

// Mock implementation of ThemeRuntime for testing
const createMockRuntime = () => {
  const calls: Array<{ method: string; args: unknown[] }> = [];

  const runtime: ThemeRuntime = {
    setAdaptiveMode(enabled: boolean) {
      calls.push({ method: "setAdaptiveMode", args: [enabled] });
    },
    setTheme(name: "light" | "dark") {
      calls.push({ method: "setTheme", args: [name] });
    },
  };

  return { runtime, calls };
};

describe("useThemeToggle", () => {
  beforeEach(() => {
    // Initialize with mock runtime before each test
    const { runtime } = createMockRuntime();
    setThemeRuntime(runtime);
  });

  it("cycles through theme modes: system -> light -> dark -> system", () => {
    const { runtime, calls } = createMockRuntime();
    setThemeRuntime(runtime);

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.mode).toBe("system");

    // First cycle: system -> light
    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe("light");
    expect(calls).toContainEqual({
      method: "setAdaptiveMode",
      args: [false],
    });
    expect(calls).toContainEqual({
      method: "setTheme",
      args: ["light"],
    });

    // Second cycle: light -> dark
    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe("dark");

    // Third cycle: dark -> system
    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe("system");
    expect(calls).toContainEqual({
      method: "setAdaptiveMode",
      args: [true],
    });
  });

  it("does not require UnistylesRuntime to test", () => {
    // This test runs without importing UnistylesRuntime at all,
    // demonstrating the decoupling benefit. Before the refactor,
    // testing this hook was coupled to the react-native-unistyles library.
    const { runtime } = createMockRuntime();
    setThemeRuntime(runtime);

    const { result } = renderHook(() => useThemeToggle());
    expect(result.current.mode).toBe("system");

    act(() => {
      result.current.cycle();
    });

    expect(result.current.mode).toBe("light");
  });
});
