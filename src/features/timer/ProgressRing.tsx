import { StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";

type ProgressRingProps = {
  size: number;
  // 0..1 fraction of the ring to fill, clockwise from the top.
  progress: number;
};

const STROKE_WIDTH = 2;

// DESIGN.md > Meditation Specifics > Progress Ring: a thin Mint Mist
// (`tertiary`) stroke that fills as the session progresses, over a faint
// full-circle track.
export function ProgressRing({ size, progress }: ProgressRingProps) {
  const { theme } = useUnistyles();
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));

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
        stroke={theme.colors.tertiary}
        strokeOpacity={0.2}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={theme.colors.tertiary}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - clamped)}
        fill="none"
        // SVG arcs start at 3 o'clock; rotate so the fill begins at the top.
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}
