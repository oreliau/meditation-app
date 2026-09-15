import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const RINGS = [{ delay: 0 }, { delay: 180 }, { delay: 360 }] as const;

const FULL_DURATION_MS = 1700;
const REDUCED_DURATION_MS = 220;

type Props = { onFinished: () => void };

// Stage 2 of the completion takeover: a brief, automatic "zen transition"
// bridging the timer's last moment and the completion screen — expanding
// rings standing in for the mockup's shockwave/particle burst, reimagined in
// Aura tokens rather than the mockup's terracotta/gold. `onFinished` fires
// once the sequence has played out (near-instantly under reduced motion).
export function CompletionTransition({ onFinished }: Props) {
  const { theme } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    const duration = reducedMotion ? REDUCED_DURATION_MS : FULL_DURATION_MS;
    textOpacity.set(withTiming(1, { duration: reducedMotion ? 0 : 400 }));
    const timeout = setTimeout(onFinished, duration);
    return () => clearTimeout(timeout);
  }, [reducedMotion, onFinished, textOpacity]);

  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.get() }));

  return (
    <View style={styles.container}>
      {!reducedMotion &&
        RINGS.map((ring) => (
          <Ring
            key={ring.delay}
            delay={ring.delay}
            color={theme.colors.primary}
          />
        ))}
      <Animated.Text style={[styles.text, textStyle]}>
        Stillness arrives
      </Animated.Text>
    </View>
  );
}

function Ring({ delay, color }: { delay: number; color: string }) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    scale.set(
      withDelay(
        delay,
        withTiming(2.4, { duration: 1200, easing: Easing.out(Easing.cubic) }),
      ),
    );
    opacity.set(
      withDelay(
        delay,
        withTiming(0, { duration: 1200, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [delay, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: opacity.get(),
  }));

  return <Animated.View style={[styles.ring, style, { borderColor: color }]} />;
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.gutter,
  },
  ring: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
  },
  text: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    textTransform: "uppercase",
    color: theme.colors.onSurfaceVariant,
  },
}));
