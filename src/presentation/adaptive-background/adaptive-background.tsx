import { Root } from "@typegpu/react";
import type { ErrorInfo, ReactNode } from "react";
import { Component, lazy, Suspense, useState } from "react";
import { View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { backgroundThemeValues } from "./background-theme-values";

const WebGpuBackgroundLayer = lazy(() => import("./webgpu-background-layer"));

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

export function AdaptiveBackground() {
  const { rt } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const [gpuFailed, setGpuFailed] = useState(false);
  const themeValues =
    backgroundThemeValues[rt.themeName === "dark" ? "dark" : "light"];

  function handleFailure() {
    setGpuFailed(true);
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: themeValues.fallbackBackground,
          experimental_backgroundImage: themeValues.fallbackGradient,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="adaptive-background"
    >
      {!gpuFailed ? (
        <WebGpuErrorBoundary onFailure={handleFailure}>
          <Suspense fallback={null}>
            <Root disableWorklets>
              <WebGpuBackgroundLayer
                themeValues={themeValues}
                reducedMotion={reducedMotion}
                onFailure={handleFailure}
              />
            </Root>
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
