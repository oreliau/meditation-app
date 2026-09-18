type GpuColor = readonly [number, number, number, number];

export interface GlowingSphereThemeValues {
  accent: GpuColor;
  glow_intensity: number;
}

interface BackgroundThemeSource {
  accent: { color: string; opacity: number };
  glow_intensity: number;
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
  accent,
  glow_intensity,
}: BackgroundThemeSource): GlowingSphereThemeValues {
  return {
    accent: toGpuColor(accent.color, accent.opacity),
    glow_intensity,
  };
}

export const glowingsphereThemeValues = {
  light: createGlowingSphereThemeValues({
    accent: { color: "#d97757", opacity: 0.34 },
    glow_intensity: 0.1,
  }),
  dark: createGlowingSphereThemeValues({
    accent: { color: "#003fff", opacity: 0.34 },
    glow_intensity: 0.09,
  }),
} as const satisfies Record<"light" | "dark", GlowingSphereThemeValues>;
