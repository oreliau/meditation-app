import "@/unistyles";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useUnistyles } from "react-native-unistyles";

export default function RootLayout() {
  const { theme, rt } = useUnistyles();

  return (
    <>
      <StatusBar style={rt.themeName === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </>
  );
}
