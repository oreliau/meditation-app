import {
  useConfigureContext,
  useMirroredUniform,
  useRoot,
  useUniform,
} from "@typegpu/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppState, useWindowDimensions } from "react-native";
import { Canvas } from "react-native-webgpu";
import { common, d, std, tgpu } from "typegpu";
import type { BackgroundThemeValues } from "./background-theme-values";
import { type FrameScheduler, startFrameLoop } from "./frame-loop";

interface WebGpuBackgroundLayerProps {
  themeValues: BackgroundThemeValues;
  reducedMotion: boolean;
  onFailure(): void;
}

const softField = tgpu.fn(
  [d.vec2f, d.vec2f, d.f32],
  d.f32,
)((point, center, radius) => {
  "use gpu";
  return (
    1.0 - std.smoothstep(radius * 0.12, radius, std.distance(point, center))
  );
});

export default function WebGpuBackgroundLayer({
  themeValues,
  reducedMotion,
  onFailure,
}: WebGpuBackgroundLayerProps) {
  const root = useRoot();
  const { ref, ctxRef } = useConfigureContext();
  const needsDraw = useRef(true);
  const staticFrameId = useRef<number | undefined>(undefined);
  const drawRef = useRef<(elapsedSeconds: number) => void>(() => {});
  const scheduleStaticFrameRef = useRef<() => void>(() => {});
  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active",
  );
  const { width, height } = useWindowDimensions();
  const renderKey = `${width}:${height}:${themeValues.fallbackBackground}:${themeValues.fallbackGradient}`;
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

  useEffect(() => {
    drawRef.current = (elapsedSeconds) => {
      if (AppState.currentState !== "active" || !ctxRef.current) {
        return;
      }
      if (reducedMotion && !needsDraw.current) {
        return;
      }
      try {
        time.write(reducedMotion ? 0 : elapsedSeconds * 2);
        pipeline.withColorAttachment({ view: ctxRef.current }).draw(3);
        ctxRef.current.present?.();
        needsDraw.current = false;
      } catch (error) {
        console.error("Error during TypeGPU frame draw:", error);
        onFailure();
      }
    };
  }, [ctxRef, onFailure, pipeline, reducedMotion, time]);

  useEffect(() => {
    scheduleStaticFrameRef.current = () => {
      if (staticFrameId.current !== undefined) {
        return;
      }
      staticFrameId.current = requestAnimationFrame(() => {
        staticFrameId.current = undefined;
        drawRef.current(0);
      });
    };

    return () => {
      scheduleStaticFrameRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    // The key intentionally invalidates the static frame for size/theme changes.
    void renderKey;
    needsDraw.current = true;
    if (reducedMotion) {
      scheduleStaticFrameRef.current();
    }
  }, [reducedMotion, renderKey]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    if (!isAppActive) {
      return;
    }
    const scheduler: FrameScheduler = {
      request: (callback) => requestAnimationFrame(callback),
      cancel: (id) => cancelAnimationFrame(id),
    };
    return startFrameLoop({
      framesPerSecond: 20,
      reducedMotion: false,
      draw: (timestamp) => drawRef.current(timestamp / 1000),
      scheduler,
    });
  }, [isAppActive, reducedMotion]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setIsAppActive(state === "active");
      if (state === "active" && reducedMotion) {
        scheduleStaticFrameRef.current();
      }
    });
    return () => subscription.remove();
  }, [reducedMotion]);

  useEffect(
    () => () => {
      if (staticFrameId.current !== undefined) {
        cancelAnimationFrame(staticFrameId.current);
      }
    },
    [],
  );

  return <Canvas ref={ref} style={{ flex: 1 }} opaque />;
}
