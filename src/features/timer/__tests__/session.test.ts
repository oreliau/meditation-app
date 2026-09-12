import {
  idleSession,
  pause,
  play,
  remainingMs,
  restart,
  restore,
  type Session,
  stop,
  tick,
} from "../session";

const DURATION_MS = 12 * 60 * 1000;
const T0 = 1_700_000_000_000;

describe("Play", () => {
  it("starts a Running session at the full configured duration from Idle", () => {
    const session = play(idleSession, T0, DURATION_MS);

    expect(session.status).toBe("Running");
    expect(remainingMs(session, T0, DURATION_MS)).toBe(DURATION_MS);
    expect(remainingMs(session, T0 + 5_000, DURATION_MS)).toBe(
      DURATION_MS - 5_000,
    );
  });
});

describe("Pause", () => {
  it("freezes the remaining time from Running", () => {
    const running = play(idleSession, T0, DURATION_MS);
    const paused = pause(running, T0 + 30_000);

    expect(paused.status).toBe("Paused");
    expect(remainingMs(paused, T0 + 30_000, DURATION_MS)).toBe(
      DURATION_MS - 30_000,
    );
    // Time keeps passing, remaining does not move.
    expect(remainingMs(paused, T0 + 90_000, DURATION_MS)).toBe(
      DURATION_MS - 30_000,
    );
  });

  it("is a no-op outside Running", () => {
    expect(pause(idleSession, T0)).toBe(idleSession);
  });
});

describe("Play from Paused", () => {
  it("resumes from the frozen remaining time, not the full duration", () => {
    const paused = pause(play(idleSession, T0, DURATION_MS), T0 + 30_000);
    const resumed = play(paused, T0 + 90_000, DURATION_MS);

    expect(resumed.status).toBe("Running");
    expect(remainingMs(resumed, T0 + 90_000, DURATION_MS)).toBe(
      DURATION_MS - 30_000,
    );
  });
});

describe("Stop", () => {
  it("ends a Running session with remaining time forced to 0", () => {
    const stopped = stop(play(idleSession, T0, DURATION_MS));

    expect(stopped.status).toBe("Stopped");
    expect(remainingMs(stopped, T0 + 1_000, DURATION_MS)).toBe(0);
  });

  it("ends a Paused session the same way", () => {
    const stopped = stop(
      pause(play(idleSession, T0, DURATION_MS), T0 + 30_000),
    );

    expect(stopped.status).toBe("Stopped");
    expect(remainingMs(stopped, T0 + 30_000, DURATION_MS)).toBe(0);
  });

  it("is a no-op when there is no session to end", () => {
    expect(stop(idleSession)).toBe(idleSession);
    const completed: Session = { status: "Completed" };
    expect(stop(completed)).toBe(completed);
  });
});

describe("Play after Stopped / Completed", () => {
  it("begins a fresh session at the full configured duration", () => {
    const stopped = stop(play(idleSession, T0, DURATION_MS));
    const restarted = play(stopped, T0 + 60_000, DURATION_MS);
    expect(remainingMs(restarted, T0 + 60_000, DURATION_MS)).toBe(DURATION_MS);

    const completed: Session = { status: "Completed" };
    const again = play(completed, T0 + 60_000, DURATION_MS);
    expect(remainingMs(again, T0 + 60_000, DURATION_MS)).toBe(DURATION_MS);
  });
});

describe("Restart", () => {
  const later = T0 + 60_000;

  it.each<[string, Session]>([
    ["Idle", idleSession],
    ["Running", play(idleSession, T0, DURATION_MS)],
    ["Paused", pause(play(idleSession, T0, DURATION_MS), T0 + 30_000)],
    ["Stopped", { status: "Stopped" }],
    ["Completed", { status: "Completed" }],
  ])(
    "from %s ends the current session and starts a fresh Running one at full duration",
    (_label, from) => {
      const restarted = restart(from, later, DURATION_MS);

      expect(restarted.status).toBe("Running");
      expect(remainingMs(restarted, later, DURATION_MS)).toBe(DURATION_MS);
    },
  );

  it("is equivalent to Stop then Play", () => {
    const paused = pause(play(idleSession, T0, DURATION_MS), T0 + 30_000);

    expect(restart(paused, later, DURATION_MS)).toEqual(
      play(stop(paused), later, DURATION_MS),
    );
  });
});

describe("Natural completion (tick)", () => {
  it("keeps Running while time remains and reports no completion", () => {
    const running = play(idleSession, T0, DURATION_MS);
    const result = tick(running, T0 + DURATION_MS - 1);

    expect(result.session).toBe(running);
    expect(result.completedNaturally).toBe(false);
  });

  it("moves to Completed once the remaining time reaches 0 on its own", () => {
    const running = play(idleSession, T0, DURATION_MS);
    const result = tick(running, T0 + DURATION_MS);

    expect(result.session.status).toBe("Completed");
    expect(result.completedNaturally).toBe(true);
    expect(remainingMs(result.session, T0 + DURATION_MS, DURATION_MS)).toBe(0);
  });

  it("reports completion only once — ticking a Completed session is quiet", () => {
    const completed = tick(
      play(idleSession, T0, DURATION_MS),
      T0 + DURATION_MS,
    ).session;
    const again = tick(completed, T0 + DURATION_MS + 1_000);

    expect(again.session).toBe(completed);
    expect(again.completedNaturally).toBe(false);
  });

  it("never reports completion for a Stopped session (Stop is the quiet ending)", () => {
    const stopped = stop(play(idleSession, T0, DURATION_MS));
    const result = tick(stopped, T0 + DURATION_MS + 1_000);

    expect(result.session.status).toBe("Stopped");
    expect(result.completedNaturally).toBe(false);
  });

  it("leaves Paused and Idle sessions untouched no matter how much time passes", () => {
    const paused = pause(play(idleSession, T0, DURATION_MS), T0 + 30_000);

    expect(tick(paused, T0 + DURATION_MS * 2)).toEqual({
      session: paused,
      completedNaturally: false,
    });
    expect(tick(idleSession, T0 + DURATION_MS * 2)).toEqual({
      session: idleSession,
      completedNaturally: false,
    });
  });
});

describe("Restore after relaunch", () => {
  it("resumes a Running session that still has time left, recomputed from the wall clock", () => {
    const running = play(idleSession, T0, DURATION_MS);
    const restored = restore(running, T0 + 60_000);

    expect(restored).toBe(running);
    expect(remainingMs(restored, T0 + 60_000, DURATION_MS)).toBe(
      DURATION_MS - 60_000,
    );
  });

  it("shows a Running session that expired while the app was closed as Completed", () => {
    const running = play(idleSession, T0, DURATION_MS);
    const restored = restore(running, T0 + DURATION_MS + 5_000);

    expect(restored.status).toBe("Completed");
    // Unlike tick(), restore() exposes no completion signal: the moment
    // already passed unobserved, so no feedback should fire on reopen.
    expect(tick(restored, T0 + DURATION_MS + 5_000).completedNaturally).toBe(
      false,
    );
  });

  it("brings back Paused / Stopped / Completed / Idle sessions as they were", () => {
    const paused = pause(play(idleSession, T0, DURATION_MS), T0 + 30_000);
    const stopped: Session = { status: "Stopped" };
    const completed: Session = { status: "Completed" };

    expect(restore(paused, T0 + DURATION_MS * 2)).toBe(paused);
    expect(restore(stopped, T0 + DURATION_MS * 2)).toBe(stopped);
    expect(restore(completed, T0 + DURATION_MS * 2)).toBe(completed);
    expect(restore(idleSession, T0 + DURATION_MS * 2)).toBe(idleSession);
  });
});
