export type ExpoAppConfigContribution = {
  plugins?: readonly (string | readonly [string, Record<string, unknown>])[];
};

export const app: ExpoAppConfigContribution = {
  plugins: [
    [
      "expo-font",
      {
        fonts: [
          "node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf",
          "node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf",
          "node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf",
          "node_modules/@expo-google-fonts/playfair-display/500Medium/PlayfairDisplay_500Medium.ttf",
          "node_modules/@expo-google-fonts/playfair-display/600SemiBold/PlayfairDisplay_600SemiBold.ttf",
        ],
      },
    ],
  ],
};
