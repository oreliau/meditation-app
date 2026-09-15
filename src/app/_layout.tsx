import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../unistyles";
import { Stack } from "expo-router";
import { SessionCompletionFeedback } from "@/features/timer/SessionCompletionFeedback";
// import { getSessionStore } from "@/features/timer/sessionStore";
// import { useSessionWidgets } from "@/features/timer/widgets";
import { useRefreshRemindersOnForeground } from "@/reminders/useRefreshRemindersOnForeground";
import { useRecordCompletedSessions } from "@/stats/useRecordCompletedSessions";
import { useLoadFonts } from "@/theme/useLoadFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();
  useRecordCompletedSessions();
  useRefreshRemindersOnForeground();
  // useSessionWidgets(getSessionStore());

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
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <SessionCompletionFeedback />
    </>
  );
}
