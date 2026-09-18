import { perlin3d } from "@typegpu/noise";
import {
  useConfigureContext,
  useFrame,
  useMirroredUniform,
  useRoot,
  useUniform,
} from "@typegpu/react";
import { sdSphere } from "@typegpu/sdf";
import { useIsFocused } from "expo-router";
import { useMemo, useRef } from "react";
import { AppState } from "react-native";
import { Canvas } from "react-native-webgpu";
import { common, d, std, tgpu } from "typegpu";
import type { GlowingSphereThemeValues } from "./glowing-sphere-theme-values";

interface WebGpuGlowingSphereLayerProps {
  themeValues: GlowingSphereThemeValues;
  reducedMotion: boolean;
  onFailure(): void;
  onReady?(): void;
  size: number;
}
const MAX_STEPS = 50;
const MAX_DIST = 30;
const SURF_DIST = 0.0001;
const SPHERE_RADIUS = 3;
const INITIAL_GLOW_INTENSITY = 0.09;
const sphereCenter = d.vec3f(10, 12.5, 20);

const Ray = d.struct({
  color: d.vec3f,
  dist: d.f32,
});

const LightRay = d.struct({
  ray: Ray,
  glow: d.vec3f,
});

const rotateAroundZ = tgpu.fn(
  [d.f32],
  d.mat3x3f,
)((angle) => {
  "use gpu";
  return d.mat3x3f(
    d.vec3f(std.cos(angle), std.sin(angle), 0),
    d.vec3f(-std.sin(angle), std.cos(angle), 0),
    d.vec3f(0, 0, 1),
  );
});

const rotateAroundX = tgpu.fn(
  [d.f32],
  d.mat3x3f,
)((angle) => {
  "use gpu";
  return d.mat3x3f(
    d.vec3f(1, 0, 0),
    d.vec3f(0, std.cos(angle), std.sin(angle)),
    d.vec3f(0, -std.sin(angle), std.cos(angle)),
  );
});

const getSphere = tgpu.fn(
  [d.vec3f, d.vec3f, d.vec3f, d.f32],
  Ray,
)((p, sphereColor, center, angle) => {
  "use gpu";
  const localP = p.sub(center);
  const rotMatZ = rotateAroundZ(-angle * 0.3);
  const rotMatX = rotateAroundX(-angle * 0.7);
  const rotatedP = localP.mul(rotMatZ).mul(rotMatX);

  const radius = d.f32(SPHERE_RADIUS);

  const rawDist = sdSphere(rotatedP, radius);
  let noise = d.f32(0);
  if (rawDist < 1) {
    noise = noise + perlin3d.sample(rotatedP.add(angle));
  }

  return Ray({
    dist: rawDist + noise,
    color: sphereColor,
  });
});

export default function WebGpuGlowingSphereLayer({
  themeValues,
  reducedMotion,
  size,
  onFailure,
  onReady,
}: WebGpuGlowingSphereLayerProps) {
  const root = useRoot();
  const { ref, ctxRef } = useConfigureContext({
    alphaMode: "premultiplied",
  });
  const isFocused = useIsFocused();
  const lastDrawTime = useRef(Number.NEGATIVE_INFINITY);
  const ready = useRef(false);
  const resolution = useMirroredUniform(d.vec2f, d.vec2f(size, size));
  const accentColor = useMirroredUniform(d.vec4f, themeValues.accent);
  const glowIntensityUniform = useMirroredUniform(
    d.f32,
    d.f32(INITIAL_GLOW_INTENSITY),
  );
  const sphereAngleUniform = useUniform(d.f32);

  const rayMarch = useMemo(
    () => (ro: d.v3f, rd: d.v3f) => {
      "use gpu";
      let distOrigin = d.f32();
      const result = Ray({
        dist: d.f32(MAX_DIST),
        color: d.vec3f(),
      });

      let glow = d.vec3f();

      for (let i = 0; i < MAX_STEPS; i++) {
        const p = rd.mul(distOrigin).add(ro);
        const scene = getSphere(
          p,
          accentColor.$.rgb,
          sphereCenter,
          sphereAngleUniform.$,
        );

        glow = glow.add(accentColor.$.rgb.mul(std.exp(-scene.dist)));
        distOrigin += scene.dist;

        if (distOrigin > MAX_DIST) {
          result.dist = MAX_DIST;
          break;
        }

        if (scene.dist < SURF_DIST) {
          result.dist = distOrigin;
          result.color = d.vec3f(scene.color);
          break;
        }
      }

      return LightRay({ ray: result, glow });
    },
    [accentColor, sphereAngleUniform],
  );

  const pipeline = useMemo(
    () =>
      root.createRenderPipeline({
        vertex: common.fullScreenTriangle,
        fragment: ({ uv }) => {
          "use gpu";
          const adjustedUv = d.vec2f(
            uv.x * (resolution.$.x / resolution.$.y),
            uv.y,
          );

          // ray origin and direction
          const ro = d.vec3f(0, 2, -1);
          const rd = std.normalize(d.vec3f(adjustedUv.x, adjustedUv.y, 1));

          // marching
          const march = rayMarch(ro, rd);

          const hitSphere = march.ray.dist < MAX_DIST;
          const sphereColor = d.vec4f(march.ray.color, hitSphere ? 1 : 0);
          const glowColor = d.vec4f(march.glow, glowIntensityUniform.$);

          return std.mix(sphereColor, glowColor, glowIntensityUniform.$);
        },
      }),
    [glowIntensityUniform, rayMarch, resolution, root],
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
      sphereAngleUniform.write(reducedMotion ? 0 : elapsedSeconds / 4);
      // glowIntensityUniform.write(INITIAL_GLOW_INTENSITY);
      pipeline.withColorAttachment({ view: ctxRef.current }).draw(3);
      ctxRef.current.present?.();
      if (!ready.current) {
        ready.current = true;
        onReady?.();
      }
      lastDrawTime.current = elapsedSeconds;
    } catch (error) {
      console.error("Error during TypeGPU frame draw:", error);
      onFailure();
    }
  });

  return <Canvas ref={ref} style={{ flex: 1 }} opaque={false} />;
}
