import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

// Primary pill CTA used at the bottom of every onboarding step, matching
// the mockups' "Continue →" / "Confirm my rhythm →" buttons.
export function OnboardingButton({ label, onPress, disabled = false }: Props) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.label}>{label}</Text>
      <MaterialIcons
        name="arrow-forward"
        size={20}
        color={theme.colors.onPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.unit,
    paddingVertical: theme.spacing.gutter,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
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
