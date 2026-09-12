import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

// Module-level: availability is a fixed property of the OS, not of a render.
const hasLiquidGlass = isLiquidGlassAvailable();

// The mockups' `.glass-panel`: real Liquid Glass where the OS offers it
// (iOS 26+), otherwise a translucent Aura surface with a soft outline so
// Android/web/older iOS read the same way.
export function GlassPanel({ style, ...props }: ViewProps) {
  if (hasLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        style={[styles.glass, style]}
        {...props}
      />
    );
  }

  return <View style={[styles.fallback, style]} {...props} />;
}

const styles = StyleSheet.create((theme) => ({
  glass: {
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
}));
