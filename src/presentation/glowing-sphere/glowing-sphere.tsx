import { Root } from "@typegpu/react";
import type { ErrorInfo, ReactNode } from "react";
import { Component, lazy, Suspense, useState } from "react";
import { View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { glowingsphereThemeValues } from "./glowing-sphere-theme-values";

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

const WebGpuBackgroundLayer = lazy(
  () => import("./webgpu-glowing-shpere-layer"),
);

export function GlowingSphere({ onReady }: { onReady?: () => void }) {
  const { rt } = useUnistyles();
  const reducedMotion = useReducedMotion();
  const [gpuFailed, setGpuFailed] = useState(false);
  const themeValues =
    glowingsphereThemeValues[rt.themeName === "dark" ? "dark" : "light"];

  function handleFailure() {
    setGpuFailed(true);
  }

  return (
    <View style={styles.root}>
      <View
        pointerEvents="none"
        style={[styles.container]}
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
                  size={100}
                  onFailure={handleFailure}
                  onReady={onReady}
                />
              </Root>
            </Suspense>
          </WebGpuErrorBoundary>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    opacity: 0.9,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
