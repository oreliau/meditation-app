import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUnistyles } from "react-native-unistyles";

export default function TabLayout() {
  const { theme } = useUnistyles();
  return (
    <NativeTabs
      backgroundColor={theme.colors.background}
      iconColor={{
        default: theme.colors.onBackground,
        selected: theme.colors.secondary,
      }}
      badgeBackgroundColor="red"
      indicatorColor={theme.colors.outlineVariant}
      labelStyle={{
        default: {
          color: theme.colors.onBackground,
        },
        selected: {
          color: theme.colors.secondary,
        },
      }}
    >
      {/* <NativeTabs.Trigger name="(home)" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger> */}
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf="timer" md="timer" />
        <NativeTabs.Trigger.Label>Timer</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explorer">
        <NativeTabs.Trigger.Icon sf="safari" md="explore" />
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
