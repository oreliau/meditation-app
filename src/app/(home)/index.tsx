import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { AdaptiveBackground } from "@/features/home/adaptive-background";
import { SettingsButton } from "@/settings/SettingsButton";
import { ThemeToggleButton } from "@/theme/ThemeToggleButton";

export default function Index() {
  return (
    <View style={styles.container}>
      <AdaptiveBackground />
      <View style={styles.content}>
        <SettingsButton />
        <Text style={styles.headline}>Lumina Flow</Text>
        <Text style={styles.body}>A quiet moment, whenever you need one.</Text>
        <Link href="/timer" asChild>
          <Pressable style={styles.primaryAction} accessibilityRole="button">
            <Text style={styles.primaryActionLabel}>Begin a session</Text>
          </Pressable>
        </Link>
        <ThemeToggleButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.gutter,
  },
  headline: {
    fontFamily: theme.typography.headlineMd.fontFamily,
    fontSize: theme.typography.headlineMd.fontSize,
    lineHeight: theme.typography.headlineMd.lineHeight,
    color: theme.colors.onBackground,
  },
  body: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
  primaryAction: {
    paddingVertical: theme.spacing.unit * 2,
    paddingHorizontal: theme.spacing.unit * 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  primaryActionLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    lineHeight: theme.typography.labelMd.lineHeight,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onPrimary,
  },
}));
