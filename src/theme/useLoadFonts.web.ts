import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
} from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import { inter, playfairDisplay } from "./typography";

// Web (see useLoadFonts.ts): app.json's expo-font plugin only links fonts
// into the native app bundle, so the web build still has to load them at
// runtime. Keys must match the `inter`/`playfairDisplay` names typography.ts
// uses as fontFamily values.
export function useLoadFonts(): boolean {
  const [fontsLoaded] = useFonts({
    [inter.regular]: Inter_400Regular,
    [inter.medium]: Inter_500Medium,
    [inter.semiBold]: Inter_600SemiBold,
    [playfairDisplay.medium]: PlayfairDisplay_500Medium,
    [playfairDisplay.semiBold]: PlayfairDisplay_600SemiBold,
  });

  return fontsLoaded;
}
