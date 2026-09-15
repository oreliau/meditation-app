export interface FrameScheduler {
  request(callback: (timestamp: number) => void): number;
  cancel(id: number): void;
}

interface FrameLoopOptions {
  framesPerSecond: number;
  reducedMotion: boolean;
  draw(timestamp: number): void;
  scheduler: FrameScheduler;
}

export function startFrameLoop({
  framesPerSecond,
  reducedMotion,
  draw,
  scheduler,
}: FrameLoopOptions): () => void {
  let frameId: number | undefined;
  let stopped = false;
  let lastDraw = Number.NEGATIVE_INFINITY;
  const minimumFrameInterval = 1000 / framesPerSecond;

  function tick(timestamp: number) {
    if (stopped) {
      return;
    }

    if (timestamp - lastDraw >= minimumFrameInterval) {
      draw(reducedMotion ? 0 : timestamp);
      lastDraw = timestamp;
      if (reducedMotion) {
        return;
      }
    }

    frameId = scheduler.request.call(globalThis, tick);
  }

  frameId = scheduler.request.call(globalThis, tick);

  return () => {
    stopped = true;
    if (frameId !== undefined) {
      scheduler.cancel.call(globalThis, frameId);
    }
  };
}
