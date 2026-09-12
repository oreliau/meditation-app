import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

// Module-level: availability is a fixed property of the OS, not of a render.
const hasLiquidGlass = isLiquidGlassAvailable();

// The mockups' `.glass-panel`: real Liquid Glass where the OS offers it
// (iOS 26+), otherwise DESIGN.md > Elevation's glass layer — a 5-10%
// `tertiary` fill with a 20% `tertiary` 1px edge — so Android/web/older iOS
// read the same way without resorting to drop shadows.
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
    // Hex alpha suffixes: 14 = 8%, 33 = 20%.
    backgroundColor: `${theme.colors.tertiary}14`,
    borderWidth: 1,
    borderColor: `${theme.colors.tertiary}33`,
  },
}));
