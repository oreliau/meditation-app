/**
 * Unistyles runtime configuration.
 *
 * This module has the side effect of registering the app's themes and
 * breakpoints, so it MUST be imported once before the app renders (see
 * `src/app/_layout.tsx`).
 */

import { StyleSheet } from "react-native-unistyles";

import { breakpoints, type AppBreakpoints } from "./theme/breakpoints";
import { themes } from "./theme/themes";

type AppThemes = typeof themes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes,
  breakpoints,
  settings: {
    // Follow the OS light/dark setting. `app.json` sets
    // `userInterfaceStyle: "automatic"` so this resolves at runtime.
    adaptiveThemes: true,
  },
});
