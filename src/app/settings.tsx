import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useReminderSettings } from "@/reminders/useReminderSettings";
import { PermissionDeniedPrompt } from "@/settings/PermissionDeniedPrompt";
import { ReminderToggleRow } from "@/settings/ReminderToggleRow";

export default function SettingsScreen() {
  const reminders = useReminderSettings();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Settings" }} />

      <Text style={styles.headline}>Settings</Text>
      <Text style={styles.subtitle}>Shape your inner sanctuary.</Text>

      <Text style={styles.sectionTitle}>Mindful notifications</Text>
      <View style={styles.card}>
        <ReminderToggleRow
          title="Morning presence reminder"
          description="A gentle invitation to be present, every day at 8:00"
          value={reminders.morningEnabled}
          onValueChange={(value) => {
            reminders.setMorningEnabled(value).catch(() => {});
          }}
        />
        <View style={styles.divider} />
        <ReminderToggleRow
          title="Evening summary"
          description="A reflection on today's practice, every day at 18:00"
          value={reminders.eveningEnabled}
          onValueChange={(value) => {
            reminders.setEveningEnabled(value).catch(() => {});
          }}
        />
        {reminders.permissionDenied && <PermissionDeniedPrompt />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.containerPaddingMobile,
    gap: theme.spacing.unit,
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
