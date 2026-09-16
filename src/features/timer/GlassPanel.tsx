import { BlurView } from "expo-blur";
import { View, type ViewProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export function GlassPanel({ children, ...props }: ViewProps) {
  const { rt } = useUnistyles();
  return (
    <View {...props}>
      <BlurView
        style={styles.blur}
        tint={rt.themeName === "dark" ? "dark" : "light"}
        intensity={88}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create((_theme) => ({
  glass: {
    overflow: "hidden",
  },

  blur: {
    ...StyleSheet.absoluteFillObject,
  },
}));
