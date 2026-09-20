import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";
import { useI18n } from "@/i18n";

type Props = { onPress: () => void };

// The completion screen's single CTA (see the completion-screen interview:
// no share/journal actions — neither has a backing feature yet). Same primary
// pill shape as OnboardingButton, kept as its own component since completion
// shouldn't depend on the onboarding feature.
export function CompletionDoneButton({ onPress }: Props) {
  const { theme } = useUnistyles();
  const { t } = useI18n();

  return (
    <Button
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={t("done")}
      testID="completion-done"
      style={styles.button}
    >
      <Text style={styles.label}>{t("done")}</Text>
      <MaterialIcons name="check" size={20} color={theme.colors.onPrimary} />
    </Button>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.unit,
    paddingVertical: theme.spacing.gutter,
    borderRadius: { xs: theme.radius.full, lg: theme.radius.md },
    backgroundColor: theme.colors.primary,
    boxShadow: theme.boxShadow.onPrimaryButton,
  },
  label: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    lineHeight: theme.typography.bodyLg.lineHeight,
    color: theme.colors.onPrimary,
  },
}));
