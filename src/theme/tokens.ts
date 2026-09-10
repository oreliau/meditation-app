/**
 * Shared design tokens from DESIGN.md ("Aura Design System - Lumina Flow").
 * These values are theme-independent (spacing, radius, typography scale).
 */

export const fontFamily = {
  /** Playfair Display — headlines, session names, quotes. */
  display: "PlayfairDisplay",
  /** Inter — all functional UI, navigation, long-form copy. */
  body: "Inter",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

/** 8px base unit rhythm. */
export const spacing = {
  none: 0,
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  gutter: 16,
  sectionGap: 48,
  containerPaddingMobile: 24,
  containerPaddingDesktop: 64,
} as const;

/** Corner radius scale. Organic, soft — avoid harsh 90-degree angles. */
export const radius = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Typography presets. Mobile-first sizes; the `*Desktop` variants scale up
 * for the fluid grid (>= md breakpoint).
 */
export const typography = {
  displayLg: {
    fontFamily: fontFamily.display,
    fontWeight: fontWeight.semibold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  },
  displayLgDesktop: {
    fontFamily: fontFamily.display,
    fontWeight: fontWeight.semibold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96,
  },
  headlineMd: {
    fontFamily: fontFamily.display,
    fontWeight: fontWeight.medium,
    fontSize: 24,
    lineHeight: 32,
  },
  headlineMdDesktop: {
    fontFamily: fontFamily.display,
    fontWeight: fontWeight.medium,
    fontSize: 32,
    lineHeight: 40,
  },
  titleLg: {
    fontFamily: fontFamily.body,
    fontWeight: fontWeight.medium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  bodyLg: {
    fontFamily: fontFamily.body,
    fontWeight: fontWeight.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: fontFamily.body,
    fontWeight: fontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: fontFamily.body,
    fontWeight: fontWeight.semibold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: fontFamily.body,
    fontWeight: fontWeight.regular,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

export const sharedTokens = {
  fontFamily,
  fontWeight,
  spacing,
  radius,
  typography,
} as const;
