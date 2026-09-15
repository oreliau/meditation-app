import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useMMKVListener } from "react-native-mmkv";
import "../unistyles";
import { Stack } from "expo-router";
// import { getSessionStore } from "@/features/timer/sessionStore";
// import { useSessionWidgets } from "@/features/timer/widgets";
import {
  getHasCompletedOnboarding,
  HAS_COMPLETED_ONBOARDING_KEY,
  onboardingStorage,
} from "@/features/onboarding/storage";
import { SessionCompletionFeedback } from "@/features/timer/SessionCompletionFeedback";
import { useRefreshRemindersOnForeground } from "@/reminders/useRefreshRemindersOnForeground";
import { useRecordCompletedSessions } from "@/stats/useRecordCompletedSessions";
import { useLoadFonts } from "@/theme/useLoadFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(
    getHasCompletedOnboarding,
  );
  useRecordCompletedSessions();
  useRefreshRemindersOnForeground();
  // useSessionWidgets(getSessionStore());

  // Reacts to onboarding's finish step flipping the persisted flag, so the
  // Stack.Protected guard below swaps from onboarding to (tabs) live.
  useMMKVListener((key) => {
    if (key === HAS_COMPLETED_ONBOARDING_KEY) {
      setHasCompletedOnboardingState(getHasCompletedOnboarding());
    }
  }, onboardingStorage);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!hasCompletedOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={hasCompletedOnboarding}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
      <SessionCompletionFeedback />
    </>
  );
}
