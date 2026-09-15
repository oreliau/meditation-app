import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { IconName } from "@/features/onboarding/content";
import { GradientOrb } from "@/features/onboarding/GradientOrb";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";

const FEATURES: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "air",
    title: "Generative shaders & sound",
    description: "Reactive visual & audio compositions",
  },
  {
    icon: "self-improvement",
    title: "Heart coherence & gentle rhythms",
    description: "Fluid harmonization of your inner state",
  },
  {
    icon: "nightlight",
    title: "A distraction-free space",
    description: "Zero notifications, pure contemplation",
  },
];

export default function OnboardingWelcomeScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen />

      <View style={styles.eyebrowRow}>
        <MaterialIcons name="spa" size={16} color={theme.colors.primary} />
        <Text style={styles.eyebrow}>AURA SANCTUARY</Text>
      </View>

      <Text style={styles.headline}>Find your inner sanctuary</Text>
      <Text style={styles.subtitle}>
        A sensory meditation experience, guided by light and conscious
        breathing.
      </Text>

      <GradientOrb label="Breathe" />

      <View style={styles.features}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <MaterialIcons
                name={feature.icon}
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <OnboardingButton
        label="Begin my journey"
        onPress={() => router.push("/onboarding/intentions")}
      />

      <View style={styles.footer}>
        <MaterialIcons
          name="favorite-border"
          size={14}
          color={theme.colors.onSurfaceVariant}
        />
        <Text style={styles.footerText}>
          Crafted with care for your peace of mind
        </Text>
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
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    padding: theme.spacing.containerPaddingMobile,
    gap: theme.spacing.sectionGap / 2,
    alignItems: "center",
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.unit / 2,
    marginTop: theme.spacing.sectionGap / 2,
  },
  eyebrow: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.primary,
  },
  headline: {
    fontFamily: theme.typography.displayLgMobile.fontFamily,
    fontSize: theme.typography.displayLgMobile.fontSize,
    lineHeight: theme.typography.displayLgMobile.lineHeight,
    letterSpacing: theme.typography.displayLgMobile.letterSpacing,
    color: theme.colors.onBackground,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
  features: {
    width: "100%",
    gap: theme.spacing.unit,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.gutter,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  featureText: {
    flex: 1,
    gap: theme.spacing.unit / 4,
  },
  featureTitle: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
  featureDescription: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.unit / 2,
    marginBottom: theme.spacing.sectionGap / 2,
  },
  footerText: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
}));
