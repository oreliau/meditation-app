import { useThemeToggle } from "@meditation-app/theme";
import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/components/Button";

export function ThemeToggleButton() {
  const { mode, cycle } = useThemeToggle();

  return (
    <Button style={styles.toggle} onPress={cycle}>
      <Text style={styles.toggleLabel}>theme: {mode}</Text>
    </Button>
  );
}

const styles = StyleSheet.create((theme) => ({
  toggle: {
    paddingVertical: theme.spacing.unit,
    paddingHorizontal: theme.spacing.unit * 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },
  toggleLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onPrimaryContainer,
  },
}));
