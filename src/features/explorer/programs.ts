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
    title: "Begin Again",
    description: "A gentle introduction to returning to the present moment.",
    sessions: [
      {
        id: "arrive",
        title: "Arrive",
        description:
          "Notice where you are, without needing to change anything.",
        durationMinutes: 5,
      },
      {
        id: "soften",
        title: "Soften",
        description:
          "Let the body release a little of what it has been holding.",
        durationMinutes: 10,
      },
      {
        id: "return",
        title: "Return",
        description: "Practice coming back to one quiet, steady breath.",
        durationMinutes: 10,
      },
    ],
  },
  {
    id: "steady-breath",
    title: "Steady Breath",
    description: "Build a calm rhythm through breath-led attention.",
    sessions: [
      {
        id: "counting",
        title: "Counting breaths",
        description: "Give the mind a simple anchor as each breath passes.",
        durationMinutes: 10,
      },
      {
        id: "open-awareness",
        title: "Open awareness",
        description:
          "Make room for sounds, sensations, and thoughts to move through.",
        durationMinutes: 12,
      },
      {
        id: "the-pause",
        title: "The pause",
        description:
          "Discover the small spaces between an exhale and an inhale.",
        durationMinutes: 15,
      },
      {
        id: "steady-ground",
        title: "Steady ground",
        description:
          "Carry a grounded quality of attention into the rest of your day.",
        durationMinutes: 15,
      },
    ],
  },
  {
    id: "sleepward",
    title: "Sleepward",
    description: "Ease out of the day with slower, softer attention.",
    sessions: [
      {
        id: "unwind",
        title: "Unwind",
        description: "Set down the unfinished edges of the day.",
        durationMinutes: 12,
      },
      {
        id: "heavy-and-held",
        title: "Heavy and held",
        description:
          "Feel the support beneath you and allow the body to settle.",
        durationMinutes: 15,
      },
      {
        id: "drift",
        title: "Drift",
        description: "Rest with the breath until there is nothing left to do.",
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
