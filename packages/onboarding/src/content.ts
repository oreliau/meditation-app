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
  | "wb-iridescent"
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

type Sound = {
  id: SoundscapeId;
  icon: IconName;
  title: string;
  originalTitle: string;
  hz: number;
  author: { name: string; link: `https://${string}` };
  source: { name: string; link: `https://${string}` };
};

export const SOUNDSCAPES: Sound[] = [
  {
    id: "amber-dawn",
    icon: "wb-sunny",
    title: "amberDawn",
    originalTitle: "leberch-meditation-513747",
    hz: 440.0,
    author: {
      name: "Nikita Kondrashev",
      link: "https://pixabay.com/users/leberch-42823964/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=513747",
    },
    source: {
      name: "Pixabay",
      link: "https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=513747",
    },
  },
  {
    id: "silent-river",
    icon: "wb-iridescent",
    title: "silentRiver",
    originalTitle: "monume-meditation-music-577979",
    author: {
      name: "Monume",
      link: "https://pixabay.com/users/monume-44679891/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=577979",
    },
    source: {
      name: "Pixabay",
      link: "https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=577979",
    },
    hz: 417.87,
  },
  {
    id: "misty-forest",
    icon: "wb-twilight",
    title: "mistyForest",
    originalTitle: "solarflex-meditation-meditation-music-589064",
    author: {
      name: "SolarFLEX",
      link: "https://pixabay.com/users/solarflex-54712313/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=589064",
    },
    source: {
      name: "Pixabay",
      link: "https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=589064",
    },
    hz: 390.65,
  },
] as const;
