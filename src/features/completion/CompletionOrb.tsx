import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { GLowingSphere } from "@/presentation/glowing-sphere/glowing-sphere";

const SIZE = 240;
const CORE_SIZE = 132;

export function CompletionOrb() {
  return (
    <View style={styles.container}>
      <GLowingSphere />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
}));
