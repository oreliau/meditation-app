export interface SanctuaryPalette {
  background: readonly [number, number, number, number];
  terracotta: readonly [number, number, number, number];
  amber: readonly [number, number, number, number];
  glow: readonly [number, number, number, number];
  fallbackBackground: string;
  fallbackGradient: string;
}

export const sanctuaryPalettes = {
  light: {
    background: [1, 0.992, 0.976, 1],
    terracotta: [0.851, 0.467, 0.341, 0.34],
    amber: [0.914, 0.659, 0.365, 0.3],
    glow: [0.992, 0.725, 0.424, 0.2],
    fallbackBackground: "#fffdf9",
    fallbackGradient:
      "radial-gradient(circle at 12% 78%, rgba(217, 119, 87, 0.34) 0%, transparent 58%), radial-gradient(circle at 84% 20%, rgba(233, 168, 93, 0.30) 0%, transparent 60%), radial-gradient(circle at 52% 52%, rgba(253, 185, 108, 0.20) 0%, transparent 68%), #fffdf9",
  },
  dark: {
    background: [0.071, 0.071, 0.114, 1],
    terracotta: [0.506, 0.239, 0.176, 0.24],
    amber: [0.494, 0.333, 0.145, 0.2],
    glow: [0.353, 0.259, 0.149, 0.16],
    fallbackBackground: "#12121d",
    fallbackGradient:
      "radial-gradient(circle at 12% 78%, rgba(129, 61, 45, 0.24) 0%, transparent 58%), radial-gradient(circle at 84% 20%, rgba(126, 85, 37, 0.20) 0%, transparent 60%), radial-gradient(circle at 52% 52%, rgba(90, 66, 38, 0.16) 0%, transparent 68%), #12121d",
  },
} as const satisfies Record<"light" | "dark", SanctuaryPalette>;
