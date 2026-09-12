import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { GlassPanel } from "./GlassPanel";

// Cross-platform glyphs: SF Symbols on iOS, Material Symbols on Android/web.
const controlIcons = {
  restart: {
    ios: "arrow.counterclockwise",
    android: "restart_alt",
    web: "restart_alt",
  },
  play: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
  pause: { ios: "pause.fill", android: "pause", web: "pause" },
  stop: { ios: "stop.fill", android: "stop", web: "stop" },
} as const satisfies Record<string, SymbolViewProps["name"]>;

type ControlButtonProps = {
  icon: keyof typeof controlIcons;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  // The Play/Pause toggle is the larger, primary-tinted centre button.
  primary?: boolean;
};

export function ControlButton({
  icon,
  label,
  onPress,
  disabled = false,
  primary = false,
}: ControlButtonProps) {
  const { theme } = useUnistyles();
  const size = primary ? 80 : 64;
  const tint = primary ? theme.colors.primary : theme.colors.onSurfaceVariant;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <GlassPanel
        style={[
          styles.panel,
          { width: size, height: size },
          primary && styles.primaryPanel,
        ]}
      >
        <SymbolView
          name={controlIcons[icon]}
          size={primary ? 32 : 24}
          tintColor={tint}
        />
      </GlassPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  pressable: {
    borderRadius: theme.radius.full,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.4,
  },
  panel: {
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryPanel: {
    borderWidth: 1,
    borderColor: theme.colors.primaryContainer,
  },
}));
