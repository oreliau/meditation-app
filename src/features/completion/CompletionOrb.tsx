import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { GlassPanel } from "@/features/timer/GlassPanel";

const SIZE = 240;
const CORE_SIZE = 132;
const RING_RADIUS = SIZE / 2 - 6;

const SPARKLES = [
  { angle: -35, distance: 108, delay: 0 },
  { angle: 40, distance: 118, delay: 220 },
  { angle: 150, distance: 104, delay: 440 },
  { angle: -140, distance: 116, delay: 660 },
] as const;

// Stage 3's centerpiece: a layered glass "halo" standing in for the
// mockup's Three.js trophy scene. Same approach as onboarding's GradientOrb
// — a slow Reanimated pulse/rotation over SVG gradients, no 3D engine.
export function CompletionOrb() {
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    pulse.set(withRepeat(withTiming(1.05, { duration: 2400 }), -1, true));
    rotation.set(
      withRepeat(
        withTiming(360, { duration: 16000, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [reducedMotion, pulse, rotation]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.get() }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.layer, glowStyle]}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <RadialGradient id="completionGlow" cx="50%" cy="50%" r="60%">
              <Stop
                offset="0%"
                stopColor={theme.colors.primaryFixed}
                stopOpacity={0.55}
              />
              <Stop
                offset="100%"
                stopColor={theme.colors.primary}
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={SIZE / 2}
            fill="url(#completionGlow)"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.layer, ringStyle]} pointerEvents="none">
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RING_RADIUS}
            stroke={theme.colors.secondary}
            strokeOpacity={0.5}
            strokeWidth={2}
            strokeDasharray="3 14"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {SPARKLES.map((sparkle) => (
        <Sparkle
          key={sparkle.angle}
          {...sparkle}
          reducedMotion={reducedMotion}
        />
      ))}

      <GlassPanel style={styles.core}>
        <MaterialIcons name="check" size={40} color={theme.colors.primary} />
      </GlassPanel>
    </View>
  );
}

function Sparkle({
  angle,
  distance,
  delay,
  reducedMotion,
}: {
  angle: number;
  distance: number;
  delay: number;
  reducedMotion: boolean;
}) {
  const { theme } = useUnistyles();
  const opacity = useSharedValue(reducedMotion ? 0.6 : 0.2);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    opacity.set(
      withDelay(
        delay,
        withRepeat(withTiming(0.9, { duration: 1600 }), -1, true),
      ),
    );
  }, [reducedMotion, delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  const radians = (angle * Math.PI) / 180;

  return (
    <Animated.View
      style={[
        styles.sparkle,
        style,
        {
          backgroundColor: theme.colors.tertiary,
          left: SIZE / 2 + Math.cos(radians) * distance - 3,
          top: SIZE / 2 + Math.sin(radians) * distance - 3,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  layer: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },
  core: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: theme.radius.full,
  },
}));
