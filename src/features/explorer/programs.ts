import type { DurationMinutes } from "@/features/timer";

export type ProgramSession = {
  id: string;
  title: string;
  description: string;
  durationMinutes: DurationMinutes;
};

export type Program = {
  id: string;
  title: string;
  description: string;
  sessions: readonly ProgramSession[];
};

export const PROGRAMS: readonly Program[] = [
  {
    id: "begin-again",
    title: "beginAgain",
    description: "beginAgainDescription",
    sessions: [
      {
        id: "arrive",
        title: "arrive",
        description: "arriveDescription",
        durationMinutes: 5,
      },
      {
        id: "soften",
        title: "soften",
        description: "softenDescription",
        durationMinutes: 10,
      },
      {
        id: "return",
        title: "returnStep",
        description: "returnStepDescription",
        durationMinutes: 10,
      },
    ],
  },
  {
    id: "steady-breath",
    title: "steadyBreath",
    description: "steadyBreathDescription",
    sessions: [
      {
        id: "counting",
        title: "countingBreaths",
        description: "countingBreathsDescription",
        durationMinutes: 10,
      },
      {
        id: "open-awareness",
        title: "openAwareness",
        description: "openAwarenessDescription",
        durationMinutes: 12,
      },
      {
        id: "the-pause",
        title: "thePause",
        description: "thePauseDescription",
        durationMinutes: 15,
      },
      {
        id: "steady-ground",
        title: "steadyGround",
        description: "steadyGroundDescription",
        durationMinutes: 15,
      },
    ],
  },
  {
    id: "sleepward",
    title: "sleepward",
    description: "sleepwardDescription",
    sessions: [
      {
        id: "unwind",
        title: "unwind",
        description: "unwindDescription",
        durationMinutes: 12,
      },
      {
        id: "heavy-and-held",
        title: "heavyAndHeld",
        description: "heavyAndHeldDescription",
        durationMinutes: 15,
      },
      {
        id: "drift",
        title: "drift",
        description: "driftDescription",
        durationMinutes: 20,
      },
    ],
  },
] as const;

export const ADVICE = [
  {
    id: "small-is-enough",
    title: "Small is enough",
    body: "A short practice still changes the shape of a day. Begin with the time you have.",
  },
  {
    id: "notice-returning",
    title: "Notice the returning",
    body: "The moment you notice your attention wandered is already a moment of presence.",
  },
  {
    id: "let-it-be-simple",
    title: "Let it be simple",
    body: "You do not need a special state of mind. Feel one breath, then the next.",
  },
  {
    id: "make-space",
    title: "Make space",
    body: "A little silence before practice can be as valuable as the practice itself.",
  },
  {
    id: "carry-one-breath",
    title: "Carry one breath",
    body: "When the day gets busy, return to the feeling of one complete exhale.",
  },
] as const;

export function getProgram(programId: string): Program | undefined {
  return PROGRAMS.find((program) => program.id === programId);
}
