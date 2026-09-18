import { Stack } from "expo-router";
import { ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useReminderSettings } from "@/reminders/useReminderSettings";
import { SectionListWithDivider } from "@/settings/list-with-divider/section-list-with-divider";
import { PermissionDeniedPrompt } from "@/settings/PermissionDeniedPrompt";
import { useSessionEndAlertSetting } from "@/settings/useSessionEndAlertSetting";
import { useThemeToggle } from "@/theme/useThemeToggle";

export default function SettingsScreen() {
  const reminders = useReminderSettings();
  const sessionEndAlert = useSessionEndAlertSetting();
  const { mode, cycle } = useThemeToggle();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen />

      <Text style={styles.headline}>Settings</Text>
      <Text style={styles.subtitle}>Shape your inner sanctuary.</Text>

      <Text style={styles.sectionTitle}>Stylew</Text>
      <SectionListWithDivider
        title="Style"
        data={[
          {
            title: "Theme",
            description: "Choose your preferred app theme",
            type: "button",
            value: mode,
            onValueChange: cycle,
          },
        ]}
      />

      <Text style={styles.sectionTitle}>Mindful notifications</Text>
      <SectionListWithDivider
        title="Mindful notifications"
        data={[
          {
            title: "Morning presence reminder",
            description: "A gentle invitation to be present, every day at 8:00",
            value: reminders.morningEnabled,
            onValueChange: (value) => {
              if (typeof value !== "boolean") return;
              reminders.setMorningEnabled(value).catch(() => {});
            },
          },
          {
            title: "Evening summary",
            description: "A reflection on today's practice, every day at 18:00",
            value: reminders.eveningEnabled,
            onValueChange: (value) => {
              if (typeof value !== "boolean") return;
              reminders.setEveningEnabled(value).catch(() => {});
            },
          },
          {
            title: "Session-end alert",
            description:
              "Let me know when my session finishes, even if I've stepped away",
            value: sessionEndAlert.enabled,
            onValueChange: (value) => {
              if (typeof value !== "boolean") return;
              sessionEndAlert.setEnabled(value).catch(() => {});
            },
          },
        ]}
        ListFooterComponent={() => (
          <>
            {(reminders.permissionDenied ||
              sessionEndAlert.permissionDenied) && <PermissionDeniedPrompt />}
          </>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: theme.spacing.containerPaddingMobile,
    gap: theme.spacing.unit,
    maxWidth: theme.maxWidth,
    width: "100%",
    marginHorizontal: "auto",
    _web: {
      paddingTop: 50,
    },
  },
  headline: {
    fontFamily: theme.typography.headlineMd.fontFamily,
    fontSize: theme.typography.headlineMd.fontSize,
    lineHeight: theme.typography.headlineMd.lineHeight,
    color: theme.colors.onBackground,
  },
  subtitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sectionGap / 2,
  },
  sectionTitle: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    lineHeight: theme.typography.titleLg.lineHeight,
    letterSpacing: theme.typography.titleLg.letterSpacing,
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  card: {
    paddingHorizontal: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
}));
