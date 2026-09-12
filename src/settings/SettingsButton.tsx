import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

// Gear icon on the home screen that pushes the Settings route. Mobile only:
// SettingsButton.web.tsx renders nothing, since Settings doesn't exist on
// web.
export function SettingsButton() {
  return (
    <Link href="/settings" asChild>
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        hitSlop={8}
      >
        <Text style={styles.glyph}>⚙</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    position: "absolute",
    top: theme.spacing.gutter,
    right: theme.spacing.gutter,
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  glyph: {
    fontSize: 22,
    color: theme.colors.onSurfaceVariant,
  },
}));
