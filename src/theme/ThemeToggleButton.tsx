import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useThemeToggle } from "./useThemeToggle";

export function ThemeToggleButton() {
  const { mode, cycle } = useThemeToggle();

  return (
    <Pressable style={styles.toggle} onPress={cycle}>
      <Text style={styles.toggleLabel}>theme: {mode}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  toggle: {
    paddingVertical: theme.spacing.unit,
    paddingHorizontal: theme.spacing.unit * 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryContainer,
  },
  toggleLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onPrimaryContainer,
  },
}));
