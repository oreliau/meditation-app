import {
  initializeNotifications,
  setDailyStatsReader,
  useRefreshRemindersOnForeground,
} from "@meditation-app/notifications";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { useMMKVListener } from "react-native-mmkv";
// import { getSessionStore } from "@meditation-app/timer";
// import { useSessionWidgets } from "@/features/timer/widgets";
import "../unistyles";
import { useLoadFonts } from "@meditation-app/fonts";
import {
  getHasCompletedOnboarding,
  HAS_COMPLETED_ONBOARDING_KEY,
  onboardingStorage,
} from "@meditation-app/onboarding";
import {
  getDailyStats,
  useRecordCompletedSessions,
} from "@meditation-app/stats";
import { useUnistyles } from "react-native-unistyles";
import { useNavigateToCompletion } from "@/features/completion/useNavigateToCompletion";
import { SessionCompletionFeedback } from "@/features/timer/SessionCompletionFeedback";
import { SessionEndAlertScheduler } from "@/features/timer/SessionEndAlertScheduler";
import { getInitialLocale, I18nProvider, loadPolyfills } from "@/i18n";

initializeNotifications();
setDailyStatsReader(getDailyStats);
SplashScreen.preventAutoHideAsync();

// Harmless upstream race in expo-router's ContextNavigator linking init on slow launches.
// See https://github.com/expo/expo/issues/47659
LogBox.ignoreLogs([
  "Can't perform a React state update on a component that hasn't mounted yet.",
]);

export default function RootLayout() {
  const { rt, theme } = useUnistyles();
  const fontsLoaded = useLoadFonts();
  const [intlLoaded, setIntlLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(
    getHasCompletedOnboarding,
  );
  useRecordCompletedSessions();
  useNavigateToCompletion();
  useRefreshRemindersOnForeground(intlLoaded);
  useEffect(() => {
    loadPolyfills(getInitialLocale()).finally(() => setIntlLoaded(true));
  }, []);
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

  if (!fontsLoaded || !intlLoaded) {
    return null;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: rt.themeName === "dark",
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: "transparent",
      card: "transparent",
      text: theme.colors.onBackground,
      border: theme.colors.outlineVariant,
      notification: theme.colors.error,
    },
  };

  return (
    <I18nProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Protected guard={hasCompletedOnboarding}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
          <Stack.Protected guard={!hasCompletedOnboarding}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>
          <Stack.Screen
            name="session-complete"
            options={{
              animation: "fade",
              presentation: "fullScreenModal",
            }}
          />
        </Stack>
        <SessionCompletionFeedback />
        <SessionEndAlertScheduler />
      </ThemeProvider>
    </I18nProvider>
  );
}
