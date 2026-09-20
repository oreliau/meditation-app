import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";
import {
  DURATION_PRESET_CONTENT,
  REMINDER_MOMENTS,
  type ReminderMoment,
} from "@/features/onboarding/content";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";
import { OnboardingProgressHeader } from "@/features/onboarding/OnboardingProgressHeader";
import {
  type DurationMinutes,
  formatDurationLabel,
} from "@/features/timer/durations";
import {
  getPersistedDurationMinutes,
  persistDurationMinutes,
} from "@/features/timer/storage";
import { useI18n } from "@/i18n";
import { useReminderSettings } from "@/reminders/useReminderSettings";

const ONBOARDING_DEFAULT_DURATION: DurationMinutes = 5;

export default function OnboardingRhythmScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { t } = useI18n();
  const reminders = useReminderSettings();

  const [durationMinutes, setDurationMinutes] = useState<DurationMinutes>(
    () => getPersistedDurationMinutes() ?? ONBOARDING_DEFAULT_DURATION,
  );
  const [moment, setMoment] = useState<ReminderMoment>(() =>
    reminders.morningEnabled ? "morning" : "evening",
  );

  const remindersOn =
    moment === "morning" ? reminders.morningEnabled : reminders.eveningEnabled;
  const momentContent = REMINDER_MOMENTS.find((m) => m.id === moment);

  function chooseDuration(minutes: DurationMinutes) {
    setDurationMinutes(minutes);
    persistDurationMinutes(minutes);
  }

  function chooseMoment(next: ReminderMoment) {
    if (next === moment) {
      return;
    }
    if (remindersOn) {
      const disablePrevious =
        moment === "morning"
          ? reminders.setMorningEnabled(false)
          : reminders.setEveningEnabled(false);
      const enableNext =
        next === "morning"
          ? reminders.setMorningEnabled(true)
          : reminders.setEveningEnabled(true);
      Promise.all([disablePrevious, enableNext]).catch(() => {});
    }
    setMoment(next);
  }

  function toggleReminders(value: boolean) {
    const setter =
      moment === "morning"
        ? reminders.setMorningEnabled
        : reminders.setEveningEnabled;
    setter(value).catch(() => {});
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen />

      <OnboardingProgressHeader
        step={3}
        label={t("dailyRhythm")}
        onBack={() => router.back()}
      />

      <Text style={styles.stepEyebrow}>{t("step3of4")}</Text>
      <Text style={styles.headline}>{t("buildRitual")}</Text>
      <Text style={styles.subtitle}>{t("ritualDescription")}</Text>

      <Text style={styles.sectionTitle}>{t("breathingDuration")}</Text>
      <View style={styles.durationGrid}>
        {DURATION_PRESET_CONTENT.map((preset) => (
          <Button
            key={preset.minutes}
            onPress={() => chooseDuration(preset.minutes)}
            role="radio"
            accessibilityRole="radio"
            accessibilityState={{
              checked: durationMinutes === preset.minutes,
            }}
            accessibilityLabel={`${formatDurationLabel(preset.minutes)} — ${t(preset.title)}`}
            testID={`duration-${preset.minutes}-minutes`}
            style={[
              styles.durationCard,
              durationMinutes === preset.minutes && styles.durationCardSelected,
            ]}
          >
            <MaterialIcons
              name={preset.icon}
              size={18}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={styles.durationLabel}>
              {formatDurationLabel(preset.minutes)}
            </Text>
            <Text style={styles.durationTitle}>{t(preset.title)}</Text>
          </Button>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t("bestMoment")}</Text>
      <View style={styles.momentRow}>
        {REMINDER_MOMENTS.map((option) => (
          <Button
            key={option.id}
            onPress={() => chooseMoment(option.id)}
            role="radio"
            accessibilityRole="radio"
            accessibilityState={{ checked: moment === option.id }}
            accessibilityLabel={t(option.label)}
            style={[
              styles.momentCard,
              moment === option.id && styles.momentCardSelected,
            ]}
          >
            <MaterialIcons
              name={option.icon}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={styles.momentLabel}>{t(option.label)}</Text>
            <Text style={styles.momentTime}>{option.time}</Text>
          </Button>
        ))}
      </View>

      <View style={styles.reminderCard}>
        <View style={styles.reminderIcon}>
          <MaterialIcons
            name="notifications-active"
            size={22}
            color={theme.colors.onPrimaryContainer}
          />
        </View>
        <View style={styles.reminderText}>
          <Text style={styles.reminderTitle}>{t("gentleReminders")}</Text>
          <Text style={styles.reminderDescription}>
            {t("reminderDescription")}
          </Text>
        </View>
        <Switch
          value={remindersOn}
          onValueChange={toggleReminders}
          accessibilityLabel={t("gentleReminders")}
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surfaceContainerLowest}
        />
      </View>

      {reminders.permissionDenied && (
        <Text style={styles.permissionDenied}>
          {t("notificationsDisabledLater")}
        </Text>
      )}

      {remindersOn && momentContent && (
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>{t("lockScreenPreview")}</Text>
          <View style={styles.previewCard}>
            <MaterialIcons
              name="notifications"
              size={16}
              color={theme.colors.primary}
            />
            <View style={styles.previewText}>
              <Text style={styles.previewApp}>
                ZENDO • {momentContent.time}
              </Text>
              <Text style={styles.previewTitle}>
                {moment === "morning"
                  ? t("morningPresence")
                  : t("eveningSummary")}
              </Text>
              <Text style={styles.previewBody}>
                {moment === "morning"
                  ? t("morningDescriptionToday")
                  : t("todayPracticeDescription")}
              </Text>
            </View>
          </View>
        </View>
      )}

      <OnboardingButton
        label={t("confirmRhythm")}
        onPress={() => router.push("/onboarding/soundscape")}
      />

      <Text style={styles.footerNote}>{t("changeAnytime")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    padding: theme.spacing.containerPaddingMobile,
    gap: theme.spacing.unit,
  },
  stepEyebrow: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.primary,
    marginTop: theme.spacing.gutter,
  },
  headline: {
    fontFamily: theme.typography.headlineMdMobile.fontFamily,
    fontSize: theme.typography.headlineMdMobile.fontSize,
    lineHeight: theme.typography.headlineMdMobile.lineHeight,
    color: theme.colors.onBackground,
  },
  subtitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.unit,
  },
  sectionTitle: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.unit,
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.unit,
  },
  durationCard: {
    flexBasis: "47%",
    flexGrow: 1,
    gap: theme.spacing.unit / 4,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: "transparent",
  },
  durationCardSelected: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  durationLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurface,
  },
  durationTitle: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  momentRow: {
    flexDirection: "row",
    gap: theme.spacing.unit,
  },
  momentCard: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.unit / 4,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: "transparent",
  },
  momentCardSelected: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  momentLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurface,
  },
  momentTime: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.gutter,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryFixed,
  },
  reminderText: {
    flex: 1,
    gap: theme.spacing.unit / 4,
  },
  reminderTitle: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurface,
  },
  reminderDescription: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
  permissionDenied: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.error,
  },
  preview: {
    gap: theme.spacing.unit / 2,
  },
  previewLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onSurfaceVariant,
  },
  previewCard: {
    flexDirection: "row",
    gap: theme.spacing.unit,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  previewText: {
    flex: 1,
    gap: theme.spacing.unit / 4,
  },
  previewApp: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  previewTitle: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurface,
  },
  previewBody: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  footerNote: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.sectionGap / 2,
  },
}));
