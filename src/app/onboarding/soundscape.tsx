import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { SOUNDSCAPES } from "@/features/onboarding/content";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";
import { OnboardingProgressHeader } from "@/features/onboarding/OnboardingProgressHeader";
import { SelectableCard } from "@/features/onboarding/SelectableCard";
import {
  getIntentions,
  getSoundscape,
  type SoundscapeId,
  setHasCompletedOnboarding,
  setSoundscape,
} from "@/features/onboarding/storage";
import { formatDurationLabel } from "@/features/timer/durations";
import { getPersistedDurationMinutes } from "@/features/timer/storage";

export default function OnboardingSoundscapeScreen() {
  const router = useRouter();
  const [soundscape, setSoundscapeState] = useState<SoundscapeId>(
    () => getSoundscape() ?? SOUNDSCAPES[0].id,
  );

  const durationMinutes = getPersistedDurationMinutes();
  const intentionCount = getIntentions().length;

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
      <Stack.Screen />

      <OnboardingProgressHeader
        step={4}
        label="SOUNDSCAPE"
        onBack={() => router.back()}
      />

      <Text style={styles.stepEyebrow}>FINAL STEP</Text>
      <Text style={styles.headline}>Your sanctuary is ready</Text>
      <Text style={styles.subtitle}>
        Choose the soundscape that will accompany your first session.
      </Text>

      {durationMinutes !== undefined && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Your setup: {formatDurationLabel(durationMinutes)} ritual
            {intentionCount > 0
              ? ` · ${intentionCount} intention${intentionCount > 1 ? "s" : ""}`
              : ""}
          </Text>
        </View>
      )}

      <View style={styles.cards}>
        {SOUNDSCAPES.map((option) => (
          <SelectableCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={`${option.hz} Hz · ${option.description}`}
            selected={soundscape === option.id}
            indicator="radio"
            onPress={() => chooseSoundscape(option.id)}
          />
        ))}
      </View>

      <OnboardingButton label="Enter the Sanctuary" onPress={finish} />
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
