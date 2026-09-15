type GpuColor = readonly [number, number, number, number];

export interface BackgroundThemeValues {
  background: GpuColor;
  accentOne: GpuColor;
  accentTwo: GpuColor;
  accentThree: GpuColor;
  fallbackBackground: string;
  fallbackGradient: string;
}

interface BackgroundThemeSource {
  background: string;
  accentOne: { color: string; opacity: number };
  accentTwo: { color: string; opacity: number };
  accentThree: { color: string; opacity: number };
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

function toCssColor(hex: string, opacity: number): string {
  const [red, green, blue] = hexToRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function createBackgroundThemeValues({
  background,
  accentOne,
  accentTwo,
  accentThree,
}: BackgroundThemeSource): BackgroundThemeValues {
  return {
    background: toGpuColor(background, 1),
    accentOne: toGpuColor(accentOne.color, accentOne.opacity),
    accentTwo: toGpuColor(accentTwo.color, accentTwo.opacity),
    accentThree: toGpuColor(accentThree.color, accentThree.opacity),
    fallbackBackground: background,
    fallbackGradient: [
      `radial-gradient(circle at 12% 78%, ${toCssColor(accentOne.color, accentOne.opacity)} 0%, transparent 58%)`,
      `radial-gradient(circle at 84% 20%, ${toCssColor(accentTwo.color, accentTwo.opacity)} 0%, transparent 60%)`,
      `radial-gradient(circle at 52% 52%, ${toCssColor(accentThree.color, accentThree.opacity)} 0%, transparent 68%)`,
    ].join(", "),
  };
}

export const backgroundThemeValues = {
  light: createBackgroundThemeValues({
    background: "#fffdf9",
    accentOne: { color: "#d97757", opacity: 0.34 },
    accentTwo: { color: "#e9a85d", opacity: 0.3 },
    accentThree: { color: "#fdb96c", opacity: 0.2 },
  }),
  dark: createBackgroundThemeValues({
    background: "#12121d",
    accentOne: { color: "#afa5ff", opacity: 0.34 },
    accentTwo: { color: "#baa5ff", opacity: 0.3 },
    accentThree: { color: "#e0f2f1", opacity: 0.2 },
  }),
} as const satisfies Record<"light" | "dark", BackgroundThemeValues>;
