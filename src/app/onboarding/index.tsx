import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CompletionOrb } from "@/features/completion/CompletionOrb";
import { OnboardingButton } from "@/features/onboarding/OnboardingButton";
import { useI18n } from "@/i18n";

export default function OnboardingWelcomeScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { t } = useI18n();
  const features = [
    {
      icon: "air" as const,
      title: t("featureShaders"),
      description: t("featureShadersDescription"),
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <View style={styles.eyebrowRow}>
        <MaterialIcons name="spa" size={16} color={theme.colors.primary} />
        <Text style={styles.eyebrow}>{t("auraSanctuary")}</Text>
      </View>

      <Text style={styles.headline}>{t("findSanctuary")}</Text>
      <Text style={styles.subtitle}>{t("welcomeDescription")}</Text>

      <CompletionOrb />

      <View style={styles.features}>
        {features.map((feature) => (
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
        label={t("beginJourney")}
        onPress={() => router.push("/onboarding/intentions")}
      />

      <View style={styles.footer}>
        <MaterialIcons
          name="favorite-border"
          size={14}
          color={theme.colors.onSurfaceVariant}
        />
        <Text style={styles.footerText}>{t("craftedWithCare")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    _web: {
      minHeight: "100vh",
    },
  },
  content: {
    flex: 1,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    padding: theme.spacing.containerPaddingMobile,
    paddingTop: rt.insets.top || theme.spacing.containerPaddingMobile,
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
