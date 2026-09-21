import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { GlowingSphere } from "@/presentation/glowing-sphere/glowing-sphere";

const SIZE = 240;

export function CompletionOrb({ onReady }: { onReady?: () => void }) {
  return (
    <View style={styles.container}>
      <GlowingSphere onReady={onReady} />
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
}));
