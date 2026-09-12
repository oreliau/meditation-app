import { useIsFocused } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus, PixelRatio } from "react-native";
import {
  Canvas,
  type CanvasRef,
  GPUBufferUsage,
  type RNCanvasContext,
} from "react-native-webgpu";
import { startFrameLoop } from "./frame-loop";
import type { SanctuaryPalette } from "./sanctuary-palette";
import { SANCTUARY_SHADER } from "./sanctuary-shader";

const TARGET_FRAMES_PER_SECOND = 20;
const UNIFORM_BUFFER_SIZE = 80;

interface SanctuaryWebGpuLayerProps {
  palette: SanctuaryPalette;
  reducedMotion: boolean;
  onFailure(): void;
}

export default function SanctuaryWebGpuLayer({
  palette,
  reducedMotion,
  onFailure,
}: SanctuaryWebGpuLayerProps) {
  const canvasRef = useRef<CanvasRef>(null);
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isFocused || appState !== "active") {
      return;
    }

    let cancelled = false;
    let stopLoop: (() => void) | undefined;
    let device: GPUDevice | undefined;
    let context: RNCanvasContext | undefined;

    async function initialize() {
      try {
        if (!("gpu" in navigator) || !navigator.gpu) {
          throw new Error("WebGPU is unavailable");
        }

        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: "low-power",
        });
        if (!adapter || cancelled) {
          if (!cancelled) {
            throw new Error("No WebGPU adapter is available");
          }
          return;
        }

        device = await adapter.requestDevice();
        if (cancelled) {
          device.destroy();
          return;
        }

        context = canvasRef.current?.getContext("webgpu") ?? undefined;
        if (!context) {
          throw new Error("The WebGPU canvas could not be initialized");
        }

        const canvas = context.canvas as HTMLCanvasElement;
        const scale = Math.min(PixelRatio.get(), 2);
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));

        const format = navigator.gpu.getPreferredCanvasFormat();
        context.configure({ device, format, alphaMode: "opaque" });

        const shader = device.createShaderModule({ code: SANCTUARY_SHADER });
        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: { module: shader, entryPoint: "vertexMain" },
          fragment: {
            module: shader,
            entryPoint: "fragmentMain",
            targets: [{ format }],
          },
          primitive: { topology: "triangle-list" },
        });
        const uniformBuffer = device.createBuffer({
          size: UNIFORM_BUFFER_SIZE,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });
        const colors = [
          ...palette.background,
          ...palette.terracotta,
          ...palette.amber,
          ...palette.glow,
        ];

        stopLoop = startFrameLoop({
          framesPerSecond: TARGET_FRAMES_PER_SECOND,
          reducedMotion,
          scheduler: {
            request: requestAnimationFrame,
            cancel: cancelAnimationFrame,
          },
          draw(timestamp) {
            if (cancelled || !device || !context) {
              return;
            }

            const uniforms = new Float32Array([
              canvas.width,
              canvas.height,
              timestamp / 1000,
              0,
              ...colors,
            ]);
            device.queue.writeBuffer(uniformBuffer, 0, uniforms);

            const encoder = device.createCommandEncoder();
            const pass = encoder.beginRenderPass({
              colorAttachments: [
                {
                  view: context.getCurrentTexture().createView(),
                  clearValue: [...palette.background],
                  loadOp: "clear",
                  storeOp: "store",
                },
              ],
            });
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.draw(3);
            pass.end();
            device.queue.submit([encoder.finish()]);
            context.present();
          },
        });
      } catch {
        if (!cancelled) {
          onFailure();
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      stopLoop?.();
      context?.unconfigure();
      device?.destroy();
    };
  }, [appState, isFocused, onFailure, palette, reducedMotion]);

  return <Canvas ref={canvasRef} style={{ flex: 1 }} opaque />;
}
