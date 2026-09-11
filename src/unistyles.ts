import { StyleSheet } from "react-native-unistyles";
import { breakpoints } from "./theme/breakpoints";
import { appThemes } from "./theme/index";
import { getPersistedThemeOverride } from "./theme/storage";

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
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
