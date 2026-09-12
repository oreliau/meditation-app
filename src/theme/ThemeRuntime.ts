// Domain interface for controlling the active theme.
// Decouples theme selection logic from styling library internals (unistyles, etc).
export interface ThemeRuntime {
  setAdaptiveMode(enabled: boolean): void;
  setTheme(name: "light" | "dark"): void;
}

let runtime: ThemeRuntime | undefined;

export function setThemeRuntime(r: ThemeRuntime): void {
  runtime = r;
}

export function getThemeRuntime(): ThemeRuntime {
  if (!runtime) {
    throw new Error("ThemeRuntime not initialized. Call setThemeRuntime() at app startup.");
  }
  return runtime;
}
