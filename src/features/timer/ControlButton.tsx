import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";
import { spacing } from "@/theme/spacing";

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
  volume: {
    ios: "speaker.wave.2.fill",
    android: "volume_up",
    web: "volume_up",
  },
  volume_off: {
    ios: "speaker.slash.fill",
    android: "volume_off",
    web: "volume_off",
  },
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
  styles.useVariants({
    size: primary ? "primary" : "secondary",
    color: primary ? "primary" : "secondary",
  });
  // 8px-grid sizes: the mockups' 80/64pt buttons with 32/24pt glyphs.
  const iconSize = spacing.unit * (primary ? 4 : 2.5);
  const tint = primary ? theme.colors.onPrimary : theme.colors.onPrimaryFixed;

  return (
    <Button
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
      <View style={styles.panel}>
        <SymbolView
          name={controlIcons[icon]}
          size={iconSize}
          tintColor={tint}
          type="monochrome"
        />
      </View>
    </Button>
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
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    variants: {
      size: {
        primary: {
          width: 64,
          height: 64,
        },
        secondary: {
          width: 48,
          height: 48,
        },
      },
      color: {
        primary: {
          backgroundColor: theme.colors.primary,
          boxShadow: theme.boxShadow.onPrimaryButton,
          _web: {
            _hover: {
              transform: "scale(1.05)",
            },
            _active: {
              transform: "scale(0.95)",
            },
          },
        },
        secondary: {
          backgroundColor: "#efece6",
          _web: {
            _hover: {
              backgroundColor: "#e9e6df",
            },
          },
        },
      },
    },
  },
}));
