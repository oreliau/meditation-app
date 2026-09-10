import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Lumina Flow</Text>
        <Text style={styles.title}>find your{"\n"}stillness</Text>
        <Text style={styles.subtitle}>
          A digital sanctuary for mindfulness — as premium as a physical retreat.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today&apos;s session</Text>
        <Text style={styles.cardTitle}>Morning Clarity</Text>
        <Text style={styles.cardBody}>10 min · breath &amp; light</Text>
        <Pressable style={styles.playButton}>
          <Text style={styles.playButtonText}>Begin</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.themeToggle}
        onPress={() => {
          UnistylesRuntime.setAdaptiveThemes(false);
          UnistylesRuntime.setTheme(
            UnistylesRuntime.themeName === "dark" ? "light" : "dark",
          );
        }}
      >
        <Text style={styles.themeToggleText}>Toggle theme</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.containerPaddingMobile,
    justifyContent: "center",
    gap: theme.spacing["2xl"],
  },
  header: {
    gap: theme.spacing.md,
  },
  eyebrow: {
    ...theme.typography.labelMd,
    color: theme.colors.tertiary,
  },
  title: {
    ...theme.typography.displayLg,
    color: theme.colors.onBackground,
  },
  subtitle: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
  card: {
    backgroundColor: theme.glass.fill,
    borderColor: theme.glass.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  cardLabel: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurfaceVariant,
  },
  cardTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
  },
  cardBody: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
  playButton: {
    marginTop: theme.spacing.md,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
  },
  playButtonText: {
    ...theme.typography.titleLg,
    color: theme.colors.onSecondary,
  },
  themeToggle: {
    alignSelf: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  themeToggleText: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurfaceVariant,
  },
}));
