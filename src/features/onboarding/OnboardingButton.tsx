import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";
import { Button } from "@/components/Button";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const UniButton = withUnistyles(Button);

// Primary pill CTA used at the bottom of every onboarding step, matching
// the mockups' "Continue →" / "Confirm my rhythm →" buttons.
export function OnboardingButton({ label, onPress, disabled = false }: Props) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <UniButton
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        testID="onboarding-continue"
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        <Text style={styles.label}>{label}</Text>
        <MaterialIcons
          name="arrow-forward"
          size={20}
          color={theme.colors.onPrimary}
        />
      </UniButton>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: "auto",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: theme.spacing.unit,
    paddingVertical: theme.spacing.gutter,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.sectionGap,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    lineHeight: theme.typography.bodyLg.lineHeight,
    color: theme.colors.onPrimary,
  },
}));
