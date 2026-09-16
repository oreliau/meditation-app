import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";

type ProgressRingProps = {
  size: number;
  // 0..1 fraction of the ring to fill, clockwise from the top.
  progress: number;
};

const STROKE_WIDTH = 6;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// DESIGN.md > Meditation Specifics > Progress Ring: a thin Mint Mist
// (`tertiary`) stroke that fills as the session progresses, over a faint
// full-circle track.
export function ProgressRing({ size, progress }: ProgressRingProps) {
  const { theme } = useUnistyles();
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  // const clamped = Math.min(1, Math.max(0, progress));
  const clamped = useSharedValue(Math.min(1, Math.max(0, progress)));
  useEffect(() => {
    clamped.set(withSpring(Math.min(1, Math.max(0, progress))));
  }, [progress, clamped]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - clamped.value),
  }));

  return (
    <Svg
      width={size}
      height={size}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`${theme.colors.tertiary}1A`}
        strokeOpacity={0.2}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />

      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#a)"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        fill="none"
        // SVG arcs start at 3 o'clock; rotate so the fill begins at the top.
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      <Defs>
        <LinearGradient id="a" x1="0%" x2="100%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.highlightOne} />
          <Stop offset="50%" stopColor={theme.colors.highlightTwo} />
          <Stop offset="100%" stopColor={theme.colors.highlightThree} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
