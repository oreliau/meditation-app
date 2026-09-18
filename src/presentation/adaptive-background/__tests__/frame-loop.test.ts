import { type FrameScheduler, startFrameLoop } from "../frame-loop";

function createScheduler() {
  let nextId = 0;
  const callbacks = new Map<number, (timestamp: number) => void>();
  const scheduler: FrameScheduler = {
    request: jest.fn((callback) => {
      const id = ++nextId;
      callbacks.set(id, callback);
      return id;
    }),
    cancel: jest.fn((id) => callbacks.delete(id)),
  };

  function run(timestamp: number) {
    const pending = [...callbacks.values()];
    callbacks.clear();
    for (const callback of pending) {
      callback(timestamp);
    }
  }

  return { scheduler, run };
}

describe("startFrameLoop", () => {
  it("caps animated rendering and stops cleanly", () => {
    const { scheduler, run } = createScheduler();
    const draw = jest.fn();
    const stop = startFrameLoop({
      framesPerSecond: 20,
      reducedMotion: false,
      draw,
      scheduler,
    });

    run(0);
    run(16);
    run(49);
    run(50);

    expect(draw).toHaveBeenCalledTimes(2);
    expect(draw).toHaveBeenNthCalledWith(1, 0);
    expect(draw).toHaveBeenNthCalledWith(2, 50);

    stop();
    run(100);
    expect(draw).toHaveBeenCalledTimes(2);
    expect(scheduler.cancel).toHaveBeenCalledTimes(1);
  });

  it.each([60, 120])("renders at 20 FPS on a %s Hz display", (refreshRate) => {
    const { scheduler, run } = createScheduler();
    const draw = jest.fn();
    const stop = startFrameLoop({
      framesPerSecond: 20,
      reducedMotion: false,
      draw,
      scheduler,
    });

    for (let frame = 0; frame < refreshRate; frame += 1) {
      run((frame * 1000) / refreshRate);
    }

    expect(draw).toHaveBeenCalledTimes(20);
    stop();
  });

  it("renders one stable frame when reduced motion is enabled", () => {
    const { scheduler, run } = createScheduler();
    const draw = jest.fn();
    startFrameLoop({
      framesPerSecond: 20,
      reducedMotion: true,
      draw,
      scheduler,
    });

    run(4321);
    run(9000);

    expect(draw).toHaveBeenCalledTimes(1);
    expect(draw).toHaveBeenCalledWith(0);
  });
});
