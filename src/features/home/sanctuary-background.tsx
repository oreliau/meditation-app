import type { ErrorInfo, ReactNode } from "react";
import { Component, lazy, Suspense, useState } from "react";
import { View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { sanctuaryPalettes } from "./sanctuary-palette";

const SanctuaryWebGpuLayer = lazy(() => import("./sanctuary-webgpu-layer"));

class WebGpuErrorBoundary extends Component<
  { children: ReactNode; onFailure(): void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SanctuaryBackground() {
  const { rt } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const [gpuFailed, setGpuFailed] = useState(false);
  const palette = sanctuaryPalettes[rt.themeName === "dark" ? "dark" : "light"];

  function handleFailure() {
    setGpuFailed(true);
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: palette.fallbackBackground,
          experimental_backgroundImage: palette.fallbackGradient,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="sanctuary-background"
    >
      {!gpuFailed ? (
        <WebGpuErrorBoundary onFailure={handleFailure}>
          <Suspense fallback={null}>
            <SanctuaryWebGpuLayer
              palette={palette}
              reducedMotion={reducedMotion}
              onFailure={handleFailure}
            />
          </Suspense>
        </WebGpuErrorBoundary>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
