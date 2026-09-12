import { Platform } from "react-native";

// Type scale transcribed from DESIGN.md's Typography tables. `letterSpacing`
// there is expressed in em; React Native wants px, so each value below is
// pre-multiplied (em * fontSize) at the point DESIGN.md specifies one.
//
// iOS uses each embedded font's PostScript name. Android uses the embedded
// filename, while web registers that same alias in useLoadFonts.web.ts.
function selectFontFamily(ios: string, fallback: string): string {
  return Platform.select({ ios, default: fallback });
}

export const playfairDisplay = {
  medium: selectFontFamily(
    "PlayfairDisplay-Medium",
    "PlayfairDisplay_500Medium",
  ),
  semiBold: selectFontFamily(
    "PlayfairDisplay-SemiBold",
    "PlayfairDisplay_600SemiBold",
  ),
} as const;

export const inter = {
  regular: selectFontFamily("Inter-Regular", "Inter_400Regular"),
  medium: selectFontFamily("Inter-Medium", "Inter_500Medium"),
  semiBold: selectFontFamily("Inter-SemiBold", "Inter_600SemiBold"),
} as const;

export const typography = {
  displayLg: {
    fontFamily: playfairDisplay.semiBold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96,
  },
  displayLgMobile: {
    fontFamily: playfairDisplay.semiBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  },
  headlineMd: {
    fontFamily: playfairDisplay.medium,
    fontSize: 32,
    lineHeight: 40,
  },
  headlineMdMobile: {
    fontFamily: playfairDisplay.medium,
    fontSize: 24,
    lineHeight: 32,
  },

  titleLg: {
    fontFamily: inter.medium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  bodyLg: {
    fontFamily: inter.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: inter.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: inter.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7,
  },
  caption: {
    fontFamily: inter.regular,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
