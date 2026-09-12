// Pure session state machine (see CONTEXT.md > Session Timer). Time is
// passed in explicitly so transitions are deterministic and testable
// without faking timers; the hook wires it to Date.now().

export type SessionStatus =
  | "Idle"
  | "Running"
  | "Paused"
  | "Stopped"
  | "Completed";

export type Session =
  | { status: "Idle" }
  // `endsAt` is an absolute epoch ms so remaining time can be recomputed
  // from the wall clock after the app was backgrounded or killed.
  | { status: "Running"; endsAt: number }
  | { status: "Paused"; remainingMs: number }
  | { status: "Stopped" }
  | { status: "Completed" };

export type Clock = {
  now: number;
  durationMs: number;
};

export const idleSession: Session = { status: "Idle" };

// Play resumes a Paused session where it left off; from any other state it
// begins a fresh session at the full configured duration.
export function play(session: Session, { now, durationMs }: Clock): Session {
  if (session.status === "Running") {
    return session;
  }

  const remaining =
    session.status === "Paused" ? session.remainingMs : durationMs;

  return { status: "Running", endsAt: now + remaining };
}

export function pause(session: Session, now: number): Session {
  if (session.status !== "Running") {
    return session;
  }

  return { status: "Paused", remainingMs: Math.max(0, session.endsAt - now) };
}

// Stop is the quiet ending: remaining time drops to 0 immediately and — unlike
// Completed — no completion feedback follows (see CONTEXT.md > Stopped).
export function stop(session: Session): Session {
  if (session.status !== "Running" && session.status !== "Paused") {
    return session;
  }

  return { status: "Stopped" };
}

// Restart both ends and begins a session (CONTEXT.md > Restart): from any
// state it yields a fresh Running session at the full configured duration.
export function restart(session: Session, clock: Clock): Session {
  return play(stop(session), clock);
}

export type TickResult = {
  session: Session;
  // True only on the tick that observed a Running session reach 0 on its own.
  // This is the sole trigger for completion feedback (haptic/sound/visual).
  completedNaturally: boolean;
};

export function tick(session: Session, now: number): TickResult {
  if (session.status === "Running" && now >= session.endsAt) {
    return { session: { status: "Completed" }, completedNaturally: true };
  }

  return { session, completedNaturally: false };
}

// Relaunch rule: a Running session that expired while the app was killed is
// shown as Completed, but deliberately without a completion signal — the
// moment already happened unobserved, so no haptic/sound/celebration.
export function restore(session: Session, now: number): Session {
  return tick(session, now).session;
}

export function remainingMs(
  session: Session,
  now: number,
  durationMs: number,
): number {
  switch (session.status) {
    case "Idle":
      return durationMs;
    case "Running":
      return Math.max(0, session.endsAt - now);
    case "Paused":
      return session.remainingMs;
    case "Stopped":
    case "Completed":
      return 0;
  }
}
