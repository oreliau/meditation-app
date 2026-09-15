import { act, renderHook } from "@testing-library/react";
import type { ThemeRuntime } from "../ThemeRuntime";
import { setThemeRuntime } from "../ThemeRuntime";
import { useThemeToggle } from "../useThemeToggle";

const createMockRuntime = () => {
  const calls: { method: string; args: unknown[] }[] = [];

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
  let mockRuntime: ReturnType<typeof createMockRuntime>;

  beforeEach(() => {
    mockRuntime = createMockRuntime();
    setThemeRuntime(mockRuntime.runtime);
  });

  it("cycles through theme modes: system -> light -> dark -> system", () => {
    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.mode).toBe("system");

    // First cycle: system -> light
    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe("light");
    expect(mockRuntime.calls).toContainEqual({
      method: "setAdaptiveMode",
      args: [false],
    });
    expect(mockRuntime.calls).toContainEqual({
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
    expect(mockRuntime.calls).toContainEqual({
      method: "setAdaptiveMode",
      args: [true],
    });
  });

  it("does not require UnistylesRuntime to test", () => {
    const { result } = renderHook(() => useThemeToggle());
    expect(result.current.mode).toBe("system");

    act(() => {
      result.current.cycle();
    });

    expect(result.current.mode).toBe("light");
  });
});
