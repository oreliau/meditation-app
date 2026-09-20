// DESIGN.md > Corner Radius. DESIGN.md's "DEFAULT" token (Tailwind-config
// convention for "the unqualified value") is named `base` here since
// `default` reads oddly as a plain object key.
export const radius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
