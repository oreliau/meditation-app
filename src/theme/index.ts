import { auraDarkColors, auraSanctuaryColors } from "./colors";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

// Only `colors` varies by theme — typography/spacing/radius are shared.
const sharedTokens = { typography, spacing, radius } as const;

// Code keys are the unistyles-conventional `light`/`dark` (required for
// adaptive theming), not DESIGN.md's display names "Aura: Sanctuary" /
// "Aura: Dark" — see CONTEXT.md's "Theme" entry.
export const appThemes = {
  light: { colors: auraSanctuaryColors, ...sharedTokens },
  dark: { colors: auraDarkColors, ...sharedTokens },
} as const;
