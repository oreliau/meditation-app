import { UnistylesRuntime } from "react-native-unistyles";
import type { ThemeRuntime } from "./ThemeRuntime";

export function createUnistylesAdapter(): ThemeRuntime {
  return {
    setAdaptiveMode(enabled: boolean): void {
      UnistylesRuntime.setAdaptiveThemes(enabled);
    },

    setTheme(name: "light" | "dark"): void {
      UnistylesRuntime.setTheme(name);
    },
  };
}
