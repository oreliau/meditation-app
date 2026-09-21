// Token values transcribed verbatim from DESIGN.md's "Aura: Dark" and
// "Aura: Sanctuary" palettes. Keys are the DESIGN.md token names transformed
// to camelCase (see CONTEXT.md's "Theme" entry) — see DESIGN.md for the
// canonical kebab-case names if you need to cross-reference.

export const commonColors = {
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",

  success: "#4caf50",
  onSuccess: "#ffffff",
  successContainer: "#c8e6c9",
  onSuccessContainer: "#1b5e20",

  warning: "#ff9800",
  onWarning: "#ffffff",
  warningContainer: "#ffe0b2",
  onWarningContainer: "#663c00",

  info: "#2196f3",
  onInfo: "#ffffff",
  infoContainer: "#bbdefb",
  onInfoContainer: "#0d47a1",
};

export const auraDarkColors = {
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

  primary: "#c2c2f2",
  onPrimary: "#2b2d53",
  primaryContainer: "#1a1b41",
  onPrimaryContainer: "#8283af",
  inversePrimary: "#5a5b84",
  primaryFixed: "#e1e0ff",
  primaryFixedDim: "#c2c2f2",
  onPrimaryFixed: "#16173d",
  onPrimaryFixedVariant: "#42436b",

  secondary: "#cdbdff",
  onSecondary: "#352072",
  secondaryContainer: "#4c388a",
  onSecondaryContainer: "#bda8ff",
  secondaryFixed: "#e8deff",
  secondaryFixedDim: "#cdbdff",
  onSecondaryFixed: "#20015d",
  onSecondaryFixedVariant: "#4c388a",

  tertiary: "#b8cac9",
  onTertiary: "#233333",
  tertiaryContainer: "#122222",
  onTertiaryContainer: "#798a8a",
  tertiaryFixed: "#d4e6e5",
  tertiaryFixedDim: "#b8cac9",
  onTertiaryFixed: "#0e1e1e",
  onTertiaryFixedVariant: "#3a4a49",

  outline: "#918f99",
  outlineVariant: "#47464e",
  background: "#12121d",
  onBackground: "#e3e0f1",
  onSurface: "#e3e0f1",
  onSurfaceVariant: "#c8c5cf",

  highlightOne: "#afa5ff",
  highlightTwo: "#baa5ff",
  highlightThree: "#e0f2f1",
} as const;

export const auraSanctuaryColors = {
  surface: "#fbf9f5",
  surfaceDim: "#dbdad6",
  surfaceBright: "#fbf9f5",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3ef",
  surfaceContainer: "#efeeea",
  surfaceContainerHigh: "#eae8e4",
  surfaceContainerHighest: "#e4e2de",
  surfaceVariant: "#e4e2de",
  surfaceTint: "#99462a",
  inverseSurface: "#30312e",
  inverseOnSurface: "#f2f0ed",

  primary: "#d97757",
  onPrimary: "#ffffff",
  primaryContainer: "#d97757",
  onPrimaryContainer: "#541400",
  inversePrimary: "#ffb59e",
  primaryFixed: "#ffdbd0",
  primaryFixedDim: "#ffb59e",
  onPrimaryFixed: "#390b00",
  onPrimaryFixedVariant: "#7a2f15",

  secondary: "#85530d",
  onSecondary: "#ffffff",
  secondaryContainer: "#fdb96c",
  onSecondaryContainer: "#774800",
  secondaryFixed: "#ffddbb",
  secondaryFixedDim: "#fdb96c",
  onSecondaryFixed: "#2b1700",
  onSecondaryFixedVariant: "#673d00",

  tertiary: "#695d4a",
  onTertiary: "#ffffff",
  tertiaryContainer: "#9f907b",
  onTertiaryContainer: "#332a1a",
  tertiaryFixed: "#f2e0c8",
  tertiaryFixedDim: "#d5c4ad",
  onTertiaryFixed: "#231a0c",
  onTertiaryFixedVariant: "#504534",

  outline: "#88726c",
  outlineVariant: "#dbc1b9",
  background: "#fbf9f5",
  onBackground: "#1b1c1a",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#55433d",

  highlightOne: "#d97757",
  highlightTwo: "#f5b041",
  highlightThree: "#e07a5f",
} as const;
