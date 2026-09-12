import { useState } from "react";
import {
  getPersistedThemeOverride,
  THEME_OVERRIDE_KEY,
  type ThemeOverride,
  themeStorage,
} from "./storage";
import { getThemeRuntime } from "./ThemeRuntime";

// "system" here is the domain term Adaptive mode; "light"/"dark" are a
// Manual override (see CONTEXT.md). The cycle always returns to "system" so
// a manual override never permanently strands the user off adaptive mode.
export type ThemeMode = ThemeOverride | "system";

const nextMode: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

function readCurrentMode(): ThemeMode {
  return getPersistedThemeOverride() ?? "system";
}

export function useThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(readCurrentMode);

  // No useCallback: `cycle` is only read as an event handler, never as an
  // effect dependency or a memoized child's prop, so a stable identity carries
  // no behavioral intent. The React Compiler (app.json `experiments.
  // reactCompiler`) caches it automatically.
  function cycle() {
    const next = nextMode[mode];
    const runtime = getThemeRuntime();

    if (next === "system") {
      themeStorage.remove(THEME_OVERRIDE_KEY);
      runtime.setAdaptiveMode(true);
    } else {
      themeStorage.set(THEME_OVERRIDE_KEY, next);
      runtime.setAdaptiveMode(false);
      runtime.setTheme(next);
    }

    setMode(next);
  }

  return { mode, cycle };
}
