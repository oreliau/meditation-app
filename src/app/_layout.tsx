import { NativeTabs } from "expo-router/unstable-native-tabs";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../unistyles";
import { SessionCompletionFeedback } from "@/features/timer/SessionCompletionFeedback";
import { useRefreshRemindersOnForeground } from "@/reminders/useRefreshRemindersOnForeground";
import { useRecordCompletedSessions } from "@/stats/useRecordCompletedSessions";
import { useLoadFonts } from "@/theme/useLoadFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();
  useRecordCompletedSessions();
  useRefreshRemindersOnForeground();

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
      <NativeTabs>
        <NativeTabs.Trigger name="(home)" disableTransparentOnScrollEdge>
          <NativeTabs.Trigger.Icon
            sf={{ default: "house", selected: "house.fill" }}
            md="home"
          />
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(explorer)">
          <NativeTabs.Trigger.Icon sf="safari" md="explore" />
          <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(timer)">
          <NativeTabs.Trigger.Icon sf="timer" md="timer" />
          <NativeTabs.Trigger.Label>Timer</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(settings)">
          <NativeTabs.Trigger.Icon
            sf={{ default: "gearshape", selected: "gearshape.fill" }}
            md="settings"
          />
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      <SessionCompletionFeedback />
    </>
  );
}
