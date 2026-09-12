import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { PlayfairDisplay_500Medium } from "@expo-google-fonts/playfair-display/500Medium";
import { PlayfairDisplay_600SemiBold } from "@expo-google-fonts/playfair-display/600SemiBold";
import { useFonts } from "expo-font";
import { inter, playfairDisplay } from "./typography";

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
