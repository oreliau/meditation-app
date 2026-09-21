import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const SIZE = 220;

// Screen 1's big gradient circle. A simple Reanimated "breathing" pulse
// stands in for the mockup's animated shader background (see the onboarding
// design decisions: the full WebGPU shader system is a deliberate fast-follow,
// not part of this first pass).
export function GradientOrb({ label }: { label: string }) {
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    scale.set(withRepeat(withTiming(1.06, { duration: 2200 }), -1, true));
  }, [reducedMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Animated.View style={[styles.orb, animatedStyle]}>
      <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="orbGradient" cx="50%" cy="45%" r="65%">
            <Stop offset="0%" stopColor={theme.colors.primaryFixed} />
            <Stop offset="100%" stopColor={theme.colors.primary} />
          </RadialGradient>
        </Defs>
        <Rect width={SIZE} height={SIZE} fill="url(#orbGradient)" />
      </Svg>
      <MaterialIcons name="spa" size={32} color={theme.colors.onPrimary} />
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme) => ({
  orb: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: theme.spacing.unit,
  },
  label: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onPrimary,
  },
}));
