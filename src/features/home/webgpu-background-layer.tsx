import {
  useConfigureContext,
  useFrame,
  useMirroredUniform,
  useRoot,
  useUniform,
} from "@typegpu/react";
import { useIsFocused } from "expo-router";
import { useMemo, useRef } from "react";
import { AppState, useWindowDimensions } from "react-native";
import { Canvas } from "react-native-webgpu";
import { common, d, std } from "typegpu";
import type { BackgroundThemeValues } from "./background-theme-values";

interface WebGpuBackgroundLayerProps {
  themeValues: BackgroundThemeValues;
  reducedMotion: boolean;
  onFailure(): void;
}

const softField = (point: d.v2f, center: d.v2f, radius: number) => {
  "use gpu";
  return (
    1.0 - std.smoothstep(radius * 0.12, radius, std.distance(point, center))
  );
};

export default function WebGpuBackgroundLayer({
  themeValues,
  reducedMotion,
  onFailure,
}: WebGpuBackgroundLayerProps) {
  const root = useRoot();
  const { ref, ctxRef } = useConfigureContext();
  const isFocused = useIsFocused();
  const lastDrawTime = useRef(Number.NEGATIVE_INFINITY);
  const { width, height } = useWindowDimensions();
  const time = useUniform(d.f32);
  const resolution = useMirroredUniform(d.vec2f, d.vec2f(width, height));
  const background = useMirroredUniform(d.vec4f, themeValues.background);
  const accentOne = useMirroredUniform(d.vec4f, themeValues.accentOne);
  const accentTwo = useMirroredUniform(d.vec4f, themeValues.accentTwo);
  const accentThree = useMirroredUniform(d.vec4f, themeValues.accentThree);

  const pipeline = useMemo(
    () =>
      root.createRenderPipeline({
        vertex: common.fullScreenTriangle,
        fragment: ({ uv }) => {
          "use gpu";
          const aspect = resolution.$.x / std.max(resolution.$.y, 1.0);
          const point = d.vec2f((uv.x - 0.5) * aspect + 0.5, uv.y);
          const drift = time.$;
          const accentOneCenter = d.vec2f(
            0.14 + std.sin(drift * 0.73) * 0.09,
            0.76 + std.cos(drift * 0.61) * 0.08,
          );
          const accentTwoCenter = d.vec2f(
            0.82 + std.cos(drift * 0.57) * 0.1,
            0.22 + std.sin(drift * 0.69) * 0.09,
          );
          const accentThreeCenter = d.vec2f(
            0.52 + std.sin(drift * 0.41) * 0.12,
            0.51 + std.cos(drift * 0.47) * 0.1,
          );
          const accentOneAmount = softField(point, accentOneCenter, 0.72);
          const accentTwoAmount = softField(point, accentTwoCenter, 0.78);
          const accentThreeAmount = softField(point, accentThreeCenter, 0.62);
          let color = d.vec3f(background.$.x, background.$.y, background.$.z);
          color = std.mix(
            color,
            d.vec3f(accentOne.$.x, accentOne.$.y, accentOne.$.z),
            accentOneAmount * accentOne.$.w,
          );
          color = std.mix(
            color,
            d.vec3f(accentTwo.$.x, accentTwo.$.y, accentTwo.$.z),
            accentTwoAmount * accentTwo.$.w,
          );
          color = std.mix(
            color,
            d.vec3f(accentThree.$.x, accentThree.$.y, accentThree.$.z),
            accentThreeAmount * accentThree.$.w,
          );
          const vignette = std.smoothstep(
            0.95,
            0.18,
            std.distance(uv, d.vec2f(0.5, 0.5)),
          );
          const vignetteScale = 0.96 + vignette * 0.04;
          color = d.vec3f(
            color.x * vignetteScale,
            color.y * vignetteScale,
            color.z * vignetteScale,
          );
          return d.vec4f(color.x, color.y, color.z, 1.0);
        },
      }),
    [accentOne, accentThree, accentTwo, background, resolution, root, time],
  );

  useFrame(({ elapsedSeconds }) => {
    if (!isFocused || AppState.currentState !== "active" || !ctxRef.current) {
      return;
    }
    if (
      reducedMotion
        ? lastDrawTime.current !== Number.NEGATIVE_INFINITY
        : elapsedSeconds - lastDrawTime.current < 1 / 20
    ) {
      return;
    }
    try {
      time.write(reducedMotion ? 0 : elapsedSeconds);
      pipeline.withColorAttachment({ view: ctxRef.current }).draw(3);
      ctxRef.current.present?.();
      lastDrawTime.current = elapsedSeconds;
    } catch (error) {
      console.error("Error during TypeGPU frame draw:", error);
      onFailure();
    }
  });

  return <Canvas ref={ref} style={{ flex: 1 }} opaque />;
}
