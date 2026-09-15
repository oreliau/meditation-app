import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
import { useReminderSettings } from "@/reminders/useReminderSettings";

const ONBOARDING_DEFAULT_DURATION: DurationMinutes = 5;

export default function OnboardingRhythmScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
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
        label="DAILY RHYTHM"
        onBack={() => router.back()}
      />

      <Text style={styles.stepEyebrow}>STEP 3 OF 4</Text>
      <Text style={styles.headline}>Let&rsquo;s build your daily ritual</Text>
      <Text style={styles.subtitle}>
        Consistency comes from gentleness, not constraint.
      </Text>

      <Text style={styles.sectionTitle}>BREATHING DURATION</Text>
      <View style={styles.durationGrid}>
        {DURATION_PRESET_CONTENT.map((preset) => (
          <Pressable
            key={preset.minutes}
            onPress={() => chooseDuration(preset.minutes)}
            accessibilityRole="radio"
            accessibilityState={{
              checked: durationMinutes === preset.minutes,
            }}
            accessibilityLabel={`${formatDurationLabel(preset.minutes)} — ${preset.title}`}
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
            <Text style={styles.durationTitle}>{preset.title}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>BEST MOMENT</Text>
      <View style={styles.momentRow}>
        {REMINDER_MOMENTS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => chooseMoment(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: moment === option.id }}
            accessibilityLabel={option.label}
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
            <Text style={styles.momentLabel}>{option.label}</Text>
            <Text style={styles.momentTime}>{option.time}</Text>
          </Pressable>
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
          <Text style={styles.reminderTitle}>Gentle reminders</Text>
          <Text style={styles.reminderDescription}>
            Receive a soft bell at your chosen moment, bringing you back to the
            present without pressure.
          </Text>
        </View>
        <Switch
          value={remindersOn}
          onValueChange={toggleReminders}
          accessibilityLabel="Gentle reminders"
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surfaceContainerLowest}
        />
      </View>

      {reminders.permissionDenied && (
        <Text style={styles.permissionDenied}>
          Notifications are turned off for Lumina Flow. You can enable them
          later in Settings.
        </Text>
      )}

      {remindersOn && momentContent && (
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>LOCK SCREEN PREVIEW</Text>
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
                {moment === "morning" ? "Morning presence" : "Evening summary"}
              </Text>
              <Text style={styles.previewBody}>
                {moment === "morning"
                  ? "A gentle invitation to be present today."
                  : "A reflection on today's practice."}
              </Text>
            </View>
          </View>
        </View>
      )}

      <OnboardingButton
        label="Confirm my rhythm"
        onPress={() => router.push("/onboarding/soundscape")}
      />

      <Text style={styles.footerNote}>
        You can change this anytime in Settings.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
