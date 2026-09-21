import { ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useI18n } from "@/i18n";
import { StackHeader } from "@/presentation/stack-header";
import { useReminderSettings } from "@/reminders";
import { LanguageSetting } from "@/settings/LanguageSetting";
import { SectionListWithDivider } from "@/settings/list-with-divider/section-list-with-divider";
import { PermissionDeniedPrompt } from "@/settings/PermissionDeniedPrompt";
import { useSessionEndAlertSetting } from "@/settings/useSessionEndAlertSetting";
import { useThemeToggle } from "@/theme/useThemeToggle";

export default function SettingsScreen() {
  const reminders = useReminderSettings();
  const sessionEndAlert = useSessionEndAlertSetting();
  const { mode, cycle } = useThemeToggle();
  const { t } = useI18n();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <StackHeader
        title={t("settings")}
        description={t("settingsDescription")}
      />

      <Text style={styles.sectionTitle}>{t("language")}</Text>
      <LanguageSetting />

      <Text style={styles.sectionTitle}>{t("style")}</Text>
      <SectionListWithDivider
        data={[
          {
            title: t("theme"),
            description: t("themeDescription"),
            type: "button",
            value: mode,
            onValueChange: cycle,
          },
        ]}
      />

      <Text style={styles.sectionTitle}>{t("mindfulNotifications")}</Text>
      <SectionListWithDivider
        data={[
          {
            title: t("morningReminder"),
            description: t("morningDescription"),
            value: reminders.morningEnabled,
            onValueChange: (value) => {
              if (typeof value !== "boolean") return;
              reminders.setMorningEnabled(value).catch(() => {});
            },
          },
          {
            title: t("eveningSummary"),
            description: t("eveningDescription"),
            value: reminders.eveningEnabled,
            onValueChange: (value) => {
              if (typeof value !== "boolean") return;
              reminders.setEveningEnabled(value).catch(() => {});
            },
          },
          {
            title: t("sessionEndAlert"),
            description: t("sessionEndDescription"),
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
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
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
