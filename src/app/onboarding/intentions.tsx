import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";
import {
  EXPERIENCE_LEVELS,
  type ExperienceLevelId,
  getExperienceLevel,
  getIntentions,
  INTENTIONS,
  type IntentionId,
  setExperienceLevel,
  setIntentions,
} from "@/features/onboarding";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";
import { OnboardingProgressHeader } from "@/features/onboarding/OnboardingProgressHeader";
import { SelectableCard } from "@/features/onboarding/SelectableCard";
import { useI18n } from "@/i18n";

const UniButton = withUnistyles(Button);

export default function OnboardingIntentionsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [selected, setSelected] = useState<IntentionId[]>(getIntentions);
  const [experienceLevel, setExperienceLevelState] =
    useState<ExperienceLevelId>(() => getExperienceLevel() ?? "beginner");

  function toggleIntention(id: IntentionId) {
    const next = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id];
    setSelected(next);
    setIntentions(next);
  }

  function chooseExperienceLevel(id: ExperienceLevelId) {
    setExperienceLevelState(id);
    setExperienceLevel(id);
  }

  const descriptor = EXPERIENCE_LEVELS.find(
    (level) => level.id === experienceLevel,
  )?.descriptor;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <OnboardingProgressHeader
        step={2}
        label={t("intentions")}
        onBack={() => router.back()}
      />

      <Text style={styles.stepEyebrow}>{t("step2of4")}</Text>
      <Text style={styles.headline}>{t("mainIntention")}</Text>
      <Text style={styles.subtitle}>{t("intentionDescription")}</Text>

      <View style={styles.hint}>
        <Text style={styles.hintText}>{t("multipleIntentions")}</Text>
      </View>

      <View style={styles.cards}>
        {INTENTIONS.map((intention) => (
          <SelectableCard
            key={intention.id}
            icon={intention.icon}
            title={t(intention.title)}
            description={t(intention.description)}
            selected={selected.includes(intention.id)}
            indicator="checkbox"
            onPress={() => toggleIntention(intention.id)}
          />
        ))}
      </View>

      <View style={styles.experienceCard}>
        <View style={styles.experienceHeader}>
          <Text style={styles.experienceTitle}>{t("experienceLevel")}</Text>
          <Text style={styles.experienceDescriptor}>
            {descriptor && t(descriptor)}
          </Text>
        </View>
        <View style={styles.experienceSegments}>
          {EXPERIENCE_LEVELS.map((level) => (
            <UniButton
              key={level.id}
              onPress={() => chooseExperienceLevel(level.id)}
              role="radio"
              accessibilityRole="radio"
              accessibilityState={{ checked: experienceLevel === level.id }}
              accessibilityLabel={t(level.label)}
              testID={`option-${level.id}`}
              style={[
                styles.experienceSegment,
                experienceLevel === level.id &&
                  styles.experienceSegmentSelected,
              ]}
            >
              <Text
                style={[
                  styles.experienceSegmentLabel,
                  experienceLevel === level.id &&
                    styles.experienceSegmentLabelSelected,
                ]}
              >
                {t(level.label)}
              </Text>
            </UniButton>
          ))}
        </View>
      </View>

      {selected.includes("sleep") && (
        <View style={styles.tip}>
          <Text style={styles.tipText}>{t("sunsetAdaptation")}</Text>
        </View>
      )}

      <OnboardingButton
        label={t("continue")}
        disabled={selected.length === 0}
        onPress={() => router.push("/onboarding/rhythm")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    _web: {
      minHeight: "100vh",
    },
  },
  content: {
    maxWidth: 480,
    paddingVertical: rt.insets.top || theme.spacing.containerPaddingMobile,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing.containerPaddingMobile,
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
  hint: {
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.secondaryContainer,
  },
  hintText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onSecondaryContainer,
  },
  cards: {
    gap: theme.spacing.unit,
  },
  experienceCard: {
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
    gap: theme.spacing.gutter,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  experienceTitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurface,
  },
  experienceDescriptor: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
  },
  experienceSegments: {
    flexDirection: "row",
    gap: theme.spacing.unit / 2,
  },
  experienceSegment: {
    flex: 1,
    paddingVertical: theme.spacing.unit,
    borderRadius: theme.radius.full,
    alignItems: "center",
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  experienceSegmentSelected: {
    backgroundColor: theme.colors.primary,
  },
  experienceSegmentLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  experienceSegmentLabelSelected: {
    color: theme.colors.onPrimary,
  },
  tip: {
    flexDirection: "row",
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.tertiaryContainer,
  },
  tipText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onTertiaryContainer,
  },
}));
