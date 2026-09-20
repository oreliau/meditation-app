import type { ExperienceLevelId, IntentionId, SoundscapeId } from "./storage";

export type IconName =
  | "spa"
  | "bedtime"
  | "self-improvement"
  | "air"
  | "bolt"
  | "water-drop"
  | "wb-sunny"
  | "nightlight"
  | "wb-twilight"
  | "water"
  | "park";

export const INTENTIONS: {
  id: IntentionId;
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    id: "stress-anxiety",
    icon: "spa",
    title: "intentionStress",
    description: "intentionStressDescription",
  },
  {
    id: "sleep",
    icon: "bedtime",
    title: "intentionSleep",
    description: "intentionSleepDescription",
  },
  {
    id: "focus-clarity",
    icon: "self-improvement",
    title: "intentionFocus",
    description: "intentionFocusDescription",
  },
  {
    id: "daily-presence",
    icon: "air",
    title: "intentionPresence",
    description: "intentionPresenceDescription",
  },
];

export const EXPERIENCE_LEVELS: {
  id: ExperienceLevelId;
  label: string;
  descriptor: string;
}[] = [
  { id: "beginner", label: "beginner", descriptor: "beginnerDescriptor" },
  { id: "regular", label: "regular", descriptor: "regularDescriptor" },
  { id: "guide", label: "guide", descriptor: "guideDescriptor" },
];

export const DURATION_PRESET_CONTENT: {
  minutes: 3 | 5 | 10 | 20;
  icon: IconName;
  title: string;
}[] = [
  { minutes: 3, icon: "bolt", title: "quickPause" },
  { minutes: 5, icon: "air", title: "gentleBreathing" },
  { minutes: 10, icon: "self-improvement", title: "guidedMeditation" },
  { minutes: 20, icon: "water-drop", title: "deepImmersion" },
];

export type ReminderMoment = "morning" | "evening";

export const REMINDER_MOMENTS: {
  id: ReminderMoment;
  icon: IconName;
  label: string;
  time: string;
}[] = [
  { id: "morning", icon: "wb-sunny", label: "morning", time: "8:00" },
  { id: "evening", icon: "nightlight", label: "evening", time: "18:00" },
];

export const SOUNDSCAPES: {
  id: SoundscapeId;
  icon: IconName;
  title: string;
  description: string;
  hz: number;
}[] = [
  {
    id: "amber-dawn",
    icon: "wb-twilight",
    title: "amberDawn",
    description: "amberDawnDescription",
    hz: 432,
  },
  {
    id: "silent-river",
    icon: "water",
    title: "silentRiver",
    description: "silentRiverDescription",
    hz: 528,
  },
  {
    id: "misty-forest",
    icon: "park",
    title: "mistyForest",
    description: "mistyForestDescription",
    hz: 396,
  },
];
