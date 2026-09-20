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
  let nextDrawAt = Number.NEGATIVE_INFINITY;
  const minimumFrameInterval = 1000 / framesPerSecond;
  const frameTimingEpsilon = 0.1;

  function tick(timestamp: number) {
    if (stopped) {
      return;
    }

    if (reducedMotion) {
      draw(0);
      return;
    }

    if (nextDrawAt === Number.NEGATIVE_INFINITY) {
      nextDrawAt = timestamp;
    }

    if (timestamp + frameTimingEpsilon >= nextDrawAt) {
      draw(timestamp);
      nextDrawAt += minimumFrameInterval;

      // Avoid catching up with a burst of draws after a long pause or a slow
      // frame. The next draw remains aligned to the current timestamp.
      if (nextDrawAt <= timestamp) {
        nextDrawAt = timestamp + minimumFrameInterval;
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
