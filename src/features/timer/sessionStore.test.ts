import { createSessionStore } from "./sessionStore";
import { getPersistedSession, timerStorage } from "./storage";

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(0);
  timerStorage.clearAll();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

it("preserves elapsed milliseconds when changing a paused session and resuming", () => {
  const store = createSessionStore();
  const completed = jest.fn();
  store.subscribeToCompletion(completed);
  store.setDurationMinutes(10);
  store.play();
  jest.setSystemTime(480_125);
  store.pause();
  expect(store.getSnapshot()).toMatchObject({
    status: "Paused",
    isActive: true,
    elapsedMs: 480_125,
  });
  store.setDurationMinutes(20);
  expect(store.getSnapshot()).toMatchObject({
    status: "Paused",
    durationMinutes: 20,
    remainingSeconds: 720,
    elapsedMs: 480_125,
  });
  expect(getPersistedSession()).toEqual({
    status: "Paused",
    remainingMs: 719_875,
  });
  jest.setSystemTime(900_000);
  store.play();
  expect(store.getSnapshot().endsAt).toBe(1_619_875);
  expect(completed).not.toHaveBeenCalled();
});

it("rejects durations at or below elapsed time without completing", () => {
  const store = createSessionStore();
  const completed = jest.fn();
  store.subscribeToCompletion(completed);
  store.setDurationMinutes(10);
  store.play();
  jest.setSystemTime(300_000);
  store.pause();
  store.setDurationMinutes(5);
  store.setDurationMinutes(3);
  expect(store.getSnapshot()).toMatchObject({
    status: "Paused",
    durationMinutes: 10,
    remainingSeconds: 300,
  });
  expect(completed).not.toHaveBeenCalled();
});

it("keeps the original duration on cancel and remains paused across relaunch", () => {
  const store = createSessionStore();
  store.setDurationMinutes(10);
  store.play();
  jest.setSystemTime(120_000);
  store.pause();
  // Cancelling discards the editor draft without a store write.
  jest.setSystemTime(500_000);
  expect(createSessionStore().getSnapshot()).toMatchObject({
    status: "Paused",
    durationMinutes: 10,
    remainingSeconds: 480,
  });
});

it("keeps guided sessions fixed when paused", () => {
  const store = createSessionStore();
  const context = { programId: "program", sessionId: "session" };
  store.setDurationMinutes(10);
  store.setProgramContext(context);
  store.play();
  store.pause();
  store.setDurationMinutes(20);
  store.setProgramContext(undefined);
  expect(store.getSnapshot()).toMatchObject({
    durationMinutes: 10,
    programContext: context,
    canChangeDuration: false,
  });
});

it("requires pausing before applying a duration and allows stopping paused sessions", () => {
  const store = createSessionStore();
  store.setDurationMinutes(10);
  store.play();
  store.setDurationMinutes(20);
  expect(store.getSnapshot().durationMinutes).toBe(10);
  store.pause();
  store.stop();
  expect(store.getSnapshot().status).toBe("Stopped");
});
