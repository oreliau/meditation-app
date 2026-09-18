import { StyleSheet } from "react-native-unistyles";
import { appThemes } from "./theme";
import { breakpoints } from "./theme/breakpoints";
import { getPersistedThemeOverride } from "./theme/storage";
import { setThemeRuntime } from "./theme/ThemeRuntime";
import { createUnistylesAdapter } from "./theme/UnistylesAdapter";

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  // Unistyles uses these empty interfaces for declaration merging.
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// `initialTheme` and `adaptiveThemes` are mutually exclusive at configure
// time, so a persisted Manual override (MMKV, read synchronously — no flash)
// pins the initial theme; otherwise Adaptive mode follows the OS setting.
const persistedOverride = getPersistedThemeOverride();

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: persistedOverride
    ? { initialTheme: persistedOverride }
    : { adaptiveThemes: true },
});

// Initialize the theme runtime adapter (decouples domain logic from unistyles)
setThemeRuntime(createUnistylesAdapter());
