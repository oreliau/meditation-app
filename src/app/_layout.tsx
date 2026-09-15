import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { useMMKVListener } from "react-native-mmkv";
import "../unistyles";
import { Stack } from "expo-router";
// import { getSessionStore } from "@/features/timer/sessionStore";
// import { useSessionWidgets } from "@/features/timer/widgets";
import { useNavigateToCompletion } from "@/features/completion/useNavigateToCompletion";
import {
  getHasCompletedOnboarding,
  HAS_COMPLETED_ONBOARDING_KEY,
  onboardingStorage,
} from "@/features/onboarding/storage";
import { SessionCompletionFeedback } from "@/features/timer/SessionCompletionFeedback";
import { SessionEndAlertScheduler } from "@/features/timer/SessionEndAlertScheduler";
import { useRefreshRemindersOnForeground } from "@/reminders/useRefreshRemindersOnForeground";
import { useRecordCompletedSessions } from "@/stats/useRecordCompletedSessions";
import { useLoadFonts } from "@/theme/useLoadFonts";

SplashScreen.preventAutoHideAsync();

// Harmless upstream race in expo-router's ContextNavigator linking init on slow launches.
// See https://github.com/expo/expo/issues/47659
LogBox.ignoreLogs([
  "Can't perform a React state update on a component that hasn't mounted yet.",
]);

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(
    getHasCompletedOnboarding,
  );
  useRecordCompletedSessions();
  useNavigateToCompletion();
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
        <Stack.Screen name="session-complete" />
      </Stack>
      <SessionCompletionFeedback />
      <SessionEndAlertScheduler />
    </>
  );
}
