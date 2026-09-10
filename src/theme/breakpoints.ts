/**
 * Breakpoints for the fluid "sanctuary" grid (DESIGN.md "Layout").
 * Mobile is a 4-column grid; `md` and up switch to the 12-column desktop grid.
 */
export const breakpoints = {
  xs: 0,
  sm: 428, // large phones
  md: 768, // tablet / desktop grid kicks in
  lg: 1024,
  xl: 1280,
} as const;

export type AppBreakpoints = typeof breakpoints;
