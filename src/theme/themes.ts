/**
 * Light ("Aura: Sanctuary") and dark ("Aura: Dark") themes from DESIGN.md.
 * Colour tokens follow the Material-style role naming used in the design doc,
 * converted to camelCase.
 */

import { sharedTokens } from "./tokens";

const darkColors = {
  // Surfaces
  surface: "#12121d",
  surfaceDim: "#12121d",
  surfaceBright: "#383845",
  surfaceContainerLowest: "#0d0d18",
  surfaceContainerLow: "#1b1a26",
  surfaceContainer: "#1f1e2a",
  surfaceContainerHigh: "#292935",
  surfaceContainerHighest: "#343440",
  surfaceVariant: "#343440",
  surfaceTint: "#c2c2f2",
  inverseSurface: "#e3e0f1",
  inverseOnSurface: "#302f3b",

  // Primary
  primary: "#c2c2f2",
  onPrimary: "#2b2d53",
  primaryContainer: "#1a1b41",
  onPrimaryContainer: "#8283af",
  inversePrimary: "#5a5b84",
  primaryFixed: "#e1e0ff",
  primaryFixedDim: "#c2c2f2",
  onPrimaryFixed: "#16173d",
  onPrimaryFixedVariant: "#42436b",

  // Secondary
  secondary: "#cdbdff",
  onSecondary: "#352072",
  secondaryContainer: "#4c388a",
  onSecondaryContainer: "#bda8ff",
  secondaryFixed: "#e8deff",
  secondaryFixedDim: "#cdbdff",
  onSecondaryFixed: "#20015d",
  onSecondaryFixedVariant: "#4c388a",

  // Tertiary
  tertiary: "#b8cac9",
  onTertiary: "#233333",
  tertiaryContainer: "#122222",
  onTertiaryContainer: "#798a8a",
  tertiaryFixed: "#d4e6e5",
  tertiaryFixedDim: "#b8cac9",
  onTertiaryFixed: "#0e1e1e",
  onTertiaryFixedVariant: "#3a4a49",

  // Error
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",

  // Outline & background
  outline: "#918f99",
  outlineVariant: "#47464e",
  background: "#12121d",
  onBackground: "#e3e0f1",
  onSurface: "#e3e0f1",
  onSurfaceVariant: "#c8c5cf",
} as const;

const lightColors = {
  // Surfaces
  surface: "#faf8ff",
  surfaceDim: "#dcd8e6",
  surfaceBright: "#faf8ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f4f0ff",
  surfaceContainer: "#eeeaff",
  surfaceContainerHigh: "#e8e4fa",
  surfaceContainerHighest: "#e2dff4",
  surfaceVariant: "#e4e0f0",
  surfaceTint: "#5a5b84",
  inverseSurface: "#302f3b",
  inverseOnSurface: "#e3e0f1",

  // Primary
  primary: "#5a5b84",
  onPrimary: "#ffffff",
  primaryContainer: "#c2c2f2",
  onPrimaryContainer: "#16173d",
  inversePrimary: "#c2c2f2",
  primaryFixed: "#e1e0ff",
  primaryFixedDim: "#c2c2f2",
  onPrimaryFixed: "#16173d",
  onPrimaryFixedVariant: "#42436b",

  // Secondary
  secondary: "#61549b",
  onSecondary: "#ffffff",
  secondaryContainer: "#e8deff",
  onSecondaryContainer: "#20015d",
  secondaryFixed: "#e8deff",
  secondaryFixedDim: "#cdbdff",
  onSecondaryFixed: "#20015d",
  onSecondaryFixedVariant: "#4c388a",

  // Tertiary
  tertiary: "#406a69",
  onTertiary: "#ffffff",
  tertiaryContainer: "#d4e6e5",
  onTertiaryContainer: "#0e1e1e",
  tertiaryFixed: "#d4e6e5",
  tertiaryFixedDim: "#b8cac9",
  onTertiaryFixed: "#0e1e1e",
  onTertiaryFixedVariant: "#3a4a49",

  // Error
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#410002",

  // Outline & background
  outline: "#767680",
  outlineVariant: "#c5c5d0",
  background: "#faf8ff",
  onBackground: "#1b1b21",
  onSurface: "#1b1b21",
  onSurfaceVariant: "#474651",
} as const;

/**
 * Glassmorphism layer values (DESIGN.md "Elevation & Depth"). Semi-transparent
 * Mint Mist fill with a bright inner edge and a heavy backdrop blur.
 */
const darkGlass = {
  fill: "rgba(184, 202, 201, 0.06)",
  fillStrong: "rgba(184, 202, 201, 0.12)",
  border: "rgba(255, 255, 255, 0.20)",
  blurIntensity: 32,
} as const;

const lightGlass = {
  fill: "rgba(64, 106, 105, 0.05)",
  fillStrong: "rgba(64, 106, 105, 0.10)",
  border: "rgba(255, 255, 255, 0.60)",
  blurIntensity: 28,
} as const;

export const lightTheme = {
  ...sharedTokens,
  colors: lightColors,
  glass: lightGlass,
} as const;

export const darkTheme = {
  ...sharedTokens,
  colors: darkColors,
  glass: darkGlass,
} as const;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type AppTheme = typeof lightTheme;
