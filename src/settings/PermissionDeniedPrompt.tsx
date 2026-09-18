import { Linking, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/components/Button";

// Inline prompt shown when turning a reminder on was refused by the OS —
// a toggle that silently stays off would look broken.
export function PermissionDeniedPrompt() {
  return (
    <View style={styles.prompt} accessibilityRole="alert">
      <Text style={styles.text}>
        Notifications are turned off for Lumina Flow. Enable them in your device
        settings to receive reminders.
      </Text>
      <Button
        onPress={() => Linking.openSettings()}
        accessibilityRole="button"
        style={styles.action}
      >
        <Text style={styles.actionLabel}>Open device settings</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  prompt: {
    marginBottom: theme.spacing.gutter,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.errorContainer,
    gap: theme.spacing.unit,
  },
  text: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onErrorContainer,
  },
  action: {
    alignSelf: "flex-start",
  },
  actionLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    lineHeight: theme.typography.labelMd.lineHeight,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onErrorContainer,
    textDecorationLine: "underline",
  },
}));
