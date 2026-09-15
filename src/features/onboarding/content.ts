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
    title: "Ease stress & anxiety",
    description:
      "Slow racing thoughts and soothe the body with gentle anchors.",
  },
  {
    id: "sleep",
    icon: "bedtime",
    title: "Deep, restorative sleep",
    description: "Soft sounds, slow 432 Hz frequencies, and muscle release.",
  },
  {
    id: "focus-clarity",
    icon: "self-improvement",
    title: "Focus & mental clarity",
    description: "Morning heart coherence and relief from cognitive overload.",
  },
  {
    id: "daily-presence",
    icon: "air",
    title: "A daily practice of presence",
    description: "Short 5-10 minute rituals anchored in your natural rhythm.",
  },
];

export const EXPERIENCE_LEVELS: {
  id: ExperienceLevelId;
  label: string;
  descriptor: string;
}[] = [
  { id: "beginner", label: "Beginner", descriptor: "Curious beginner" },
  { id: "regular", label: "Regular", descriptor: "Committed practitioner" },
  { id: "guide", label: "Zen guide", descriptor: "Seasoned guide" },
];

export const DURATION_PRESET_CONTENT: {
  minutes: 3 | 5 | 10 | 20;
  icon: IconName;
  title: string;
}[] = [
  { minutes: 3, icon: "bolt", title: "Quick pause" },
  { minutes: 5, icon: "air", title: "Gentle breathing" },
  { minutes: 10, icon: "self-improvement", title: "Guided meditation" },
  { minutes: 20, icon: "water-drop", title: "Deep immersion" },
];

export type ReminderMoment = "morning" | "evening";

export const REMINDER_MOMENTS: {
  id: ReminderMoment;
  icon: IconName;
  label: string;
  time: string;
}[] = [
  { id: "morning", icon: "wb-sunny", label: "Morning", time: "8:00" },
  { id: "evening", icon: "nightlight", label: "Evening", time: "18:00" },
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
    title: "Amber Dawn",
    description: "Tibetan bowl, sacred resonance",
    hz: 432,
  },
  {
    id: "silent-river",
    icon: "water",
    title: "Silent River",
    description: "Clear water flows & gentle currents",
    hz: 528,
  },
  {
    id: "misty-forest",
    icon: "park",
    title: "Misty Forest",
    description: "Rustling leaves & distant birdsong",
    hz: 396,
  },
];
