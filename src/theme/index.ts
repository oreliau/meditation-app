import { typography } from "@/theme/typography";
import { auraDarkColors, auraSanctuaryColors, commonColors } from "./colors";
import { radius } from "./radius";
import { auraDarkShadows, auraLightShadows } from "./shadows";
import { spacing } from "./spacing";

// Only `colors` varies by theme — typography/spacing/radius are shared.
const sharedTokens = { typography, spacing, radius, maxWidth: 700 } as const;

// Code keys are the unistyles-conventional `light`/`dark` (required for
// adaptive theming), not DESIGN.md's display names "Aura: Sanctuary" /
// "Aura: Dark" — see CONTEXT.md's "Theme" entry.
export const appThemes = {
  light: {
    colors: { ...commonColors, ...auraSanctuaryColors },
    boxShadow: auraLightShadows,
    ...sharedTokens,
  },
  dark: {
    colors: { ...commonColors, ...auraDarkColors },
    boxShadow: auraDarkShadows,
    ...sharedTokens,
  },
} as const;

export { breakpoints } from "./breakpoints";
export * from "./spacing";
export { getPersistedThemeOverride } from "./storage";
export { setThemeRuntime } from "./ThemeRuntime";
export { createUnistylesAdapter } from "./UnistylesAdapter";
export { useThemeToggle } from "./useThemeToggle";
