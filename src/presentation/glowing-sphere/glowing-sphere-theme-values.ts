type GpuColor = readonly [number, number, number, number];

export interface GlowingSphereThemeValues {
  accent: GpuColor;
  fallbackBackground: string;
}

interface BackgroundThemeSource {
  accent: { color: string; opacity: number };
  background: string;
}

function hexToRgb(hex: string): readonly [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

function toGpuColor(hex: string, opacity: number): GpuColor {
  const [red, green, blue] = hexToRgb(hex);
  return [red / 255, green / 255, blue / 255, opacity];
}

function createGlowingSphereThemeValues({
  background,
  accent,
}: BackgroundThemeSource): GlowingSphereThemeValues {
  return {
    accent: toGpuColor(accent.color, accent.opacity),
    fallbackBackground: background,
  };
}

export const glowingsphereThemeValues = {
  light: createGlowingSphereThemeValues({
    background: "#fffdf9",
    accent: { color: "#d97757", opacity: 0.34 },
  }),
  dark: createGlowingSphereThemeValues({
    background: "#12121d",
    accent: { color: "#003fff", opacity: 0.34 },
  }),
} as const satisfies Record<"light" | "dark", GlowingSphereThemeValues>;
