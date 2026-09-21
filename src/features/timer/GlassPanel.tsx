import { BlurView } from "expo-blur";
import { View, type ViewProps } from "react-native";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";

const UniBlurView = withUnistyles(BlurView);

export function GlassPanel({ children, ...props }: ViewProps) {
  const { rt } = useUnistyles();
  return (
    <View {...props}>
      <UniBlurView
        style={styles.blur}
        tint={rt.themeName === "dark" ? "dark" : "light"}
        intensity={88}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    overflow: "hidden",
  },

  blur: {
    ...StyleSheet.absoluteFill,
  },
});
