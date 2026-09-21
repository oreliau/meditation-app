import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";
import { Button } from "@/components/Button";
import {
  DURATION_PRESET_CONTENT,
  REMINDER_MOMENTS,
  type ReminderMoment,
} from "@/features/onboarding";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";
import { OnboardingProgressHeader } from "@/features/onboarding/OnboardingProgressHeader";
import {
  type DurationMinutes,
  formatDurationLabel,
  getPersistedDurationMinutes,
  persistDurationMinutes,
} from "@/features/timer";
import { useI18n } from "@/i18n";

const UniButton = withUnistyles(Button);
const ONBOARDING_DEFAULT_DURATION: DurationMinutes = 5;

// Web variant: reminders don't exist on web at all (see
// src/reminders/ExpoNotificationsClient.web.ts and settings/index.web.tsx),
// and "Best moment" only exists to set a reminder's time, so both are
// dropped here rather than shown as dead UI. Splitting into a `.web.tsx`
// file (this app's established pattern for mobile-only features) also
// keeps `useReminderSettings` — which reads mobile-only MMKV storage
// without an `isStorageAvailable()` guard — out of the web bundle
// entirely, avoiding a crash during static prerendering.
export default function OnboardingRhythmScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { t } = useI18n();

  const [durationMinutes, setDurationMinutes] = useState<DurationMinutes>(
    () => getPersistedDurationMinutes() ?? ONBOARDING_DEFAULT_DURATION,
  );
  const [moment, setMoment] = useState<ReminderMoment>("morning");

  function chooseDuration(minutes: DurationMinutes) {
    setDurationMinutes(minutes);
    persistDurationMinutes(minutes);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
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
          <UniButton
            key={preset.minutes}
            onPress={() => chooseDuration(preset.minutes)}
            role="radio"
            accessibilityRole="radio"
            accessibilityState={{
              checked: durationMinutes === preset.minutes,
            }}
            accessibilityLabel={`${formatDurationLabel(preset.minutes)} — ${t(preset.title)}`}
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
          </UniButton>
        ))}
      </View>

      <Text style={styles.sectionTitle}>BEST MOMENT</Text>
      <View style={styles.momentRow}>
        {REMINDER_MOMENTS.map((option) => (
          <UniButton
            key={option.id}
            onPress={() => setMoment(option.id)}
            role="radio"
            accessibilityRole="radio"
            accessibilityState={{ checked: moment === option.id }}
            accessibilityLabel={option.label}
            style={[
              styles.momentCard,
              moment === option.id && styles.momentCardSelected,
            ]}
          >
            <Text style={styles.momentLabel}>{option.label}</Text>
            <Text style={styles.momentTime}>{option.time}</Text>
          </UniButton>
        ))}
      </View>

      <OnboardingButton
        label={t("confirmRhythm")}
        onPress={() => router.push("/onboarding/soundscape")}
      />

      <Text style={styles.footerNote}>{t("changeAnytimeApp")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    _web: {
      minHeight: "100vh",
    },
  },
  content: {
    flexGrow: 1,
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
  momentRow: {
    flexDirection: "row",
    gap: theme.spacing.unit,
  },
  momentCard: {
    flex: 1,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
    alignItems: "center",
    gap: theme.spacing.unit / 4,
  },
  momentCardSelected: {
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  momentLabel: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    color: theme.colors.onSurface,
  },
  momentTime: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurfaceVariant,
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
  footerNote: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.sectionGap / 2,
  },
}));
