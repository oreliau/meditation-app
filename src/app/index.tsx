import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemeToggleButton } from "@/theme/ThemeToggleButton";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Lumina Flow</Text>
      <Text style={styles.body}>Edit src/app/index.tsx to edit this screen.</Text>
      <ThemeToggleButton />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.gutter,
    backgroundColor: theme.colors.background,
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
}));
