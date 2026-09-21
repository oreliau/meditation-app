import {
  getIntentions,
  getSoundscape,
  SOUNDSCAPES,
  type SoundscapeId,
  setHasCompletedOnboarding,
  setSoundscape,
} from "@meditation-app/onboarding";
import {
  formatDurationLabel,
  getPersistedDurationMinutes,
} from "@meditation-app/timer";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";
import { OnboardingProgressHeader } from "@/features/onboarding/OnboardingProgressHeader";
import { SelectableCard } from "@/features/onboarding/SelectableCard";
import { formatList, formatNumber, useI18n } from "@/i18n";

const UniLink = withUnistyles(Link);

export default function OnboardingSoundscapeScreen() {
  const router = useRouter();
  const { language, t } = useI18n();
  const [soundscape, setSoundscapeState] = useState<SoundscapeId>(
    () => getSoundscape() ?? SOUNDSCAPES[0].id,
  );

  const durationMinutes = getPersistedDurationMinutes();
  const intentionLabels = getIntentions().map((id) =>
    t(
      {
        "stress-anxiety": "intentionStress",
        sleep: "intentionSleep",
        "focus-clarity": "intentionFocus",
        "daily-presence": "intentionPresence",
      }[id],
    ),
  );

  function chooseSoundscape(id: SoundscapeId) {
    setSoundscapeState(id);
    setSoundscape(id);
  }

  function finish() {
    setHasCompletedOnboarding();
    // No imperative navigation here: flipping the persisted flag re-renders
    // the root layout's Stack.Protected guard, which swaps in (tabs) and
    // resets to its initial route on its own.
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <OnboardingProgressHeader
        step={4}
        label={t("soundscape")}
        onBack={() => router.back()}
      />

      <Text style={styles.stepEyebrow}>{t("finalStep")}</Text>
      <Text style={styles.headline}>{t("sanctuaryReady")}</Text>
      <Text style={styles.subtitle}>{t("soundscapeDescription")}</Text>

      {durationMinutes !== undefined && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {t("yourSetup")} {formatDurationLabel(durationMinutes)}{" "}
            {t("ritual")}
            {intentionLabels.length > 0
              ? ` · ${formatList(intentionLabels, language)}`
              : ""}
          </Text>
        </View>
      )}

      <View style={styles.cards}>
        {SOUNDSCAPES.map((option) => (
          <SelectableCard
            key={option.id}
            icon={option.icon}
            title={t(option.title)}
            description={
              <Text>
                <Text>{formatNumber(option.hz, language)} Hz</Text>
                {" · Music by "}
                <UniLink
                  href={option.author.link}
                  target="_blank"
                  style={styles.link}
                >
                  {t(option.author.name)}
                </UniLink>
                {" from "}
                <UniLink
                  href={option.source.link}
                  target="_blank"
                  style={styles.link}
                >
                  {t(option.source.name)}
                </UniLink>
              </Text>
            }
            selected={soundscape === option.id}
            indicator="radio"
            onPress={() => chooseSoundscape(option.id)}
          />
        ))}
      </View>

      <OnboardingButton label={t("enterSanctuary")} onPress={finish} />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    _web: {
      minHeight: "100vh",
    },
  },
  link: {
    textDecorationLine: "underline",
    web: {
      _hover: {
        color: theme.colors.info,
      },
    },
  },
  content: {
    flex: 1,
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
  summary: {
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceContainer,
  },
  summaryText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  cards: {
    gap: theme.spacing.unit,
    marginBottom: theme.spacing.sectionGap / 2,
  },
}));
