import { createMMKV } from "react-native-mmkv";
import { isStorageAvailable } from "@/storage/isStorageAvailable";

// Same shape as src/theme/storage.ts and src/features/timer/storage.ts.
export const onboardingStorage = createMMKV({ id: "aura-onboarding" });

export const HAS_COMPLETED_ONBOARDING_KEY = "hasCompletedOnboarding";
export const INTENTIONS_KEY = "intentions";
export const EXPERIENCE_LEVEL_KEY = "experienceLevel";
export const SOUNDSCAPE_KEY = "soundscape";

export function getHasCompletedOnboarding(): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  return onboardingStorage.getBoolean(HAS_COMPLETED_ONBOARDING_KEY) ?? false;
}

export function setHasCompletedOnboarding(): void {
  if (isStorageAvailable()) {
    onboardingStorage.set(HAS_COMPLETED_ONBOARDING_KEY, true);
  }
}

export const INTENTION_IDS = [
  "stress-anxiety",
  "sleep",
  "focus-clarity",
  "daily-presence",
] as const;

export type IntentionId = (typeof INTENTION_IDS)[number];

export function isIntentionId(value: unknown): value is IntentionId {
  return (INTENTION_IDS as readonly string[]).includes(value as string);
}

export function getIntentions(): IntentionId[] {
  if (!isStorageAvailable()) {
    return [];
  }

  const raw = onboardingStorage.getString(INTENTIONS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isIntentionId) : [];
  } catch {
    return [];
  }
}

export function setIntentions(intentions: IntentionId[]): void {
  if (isStorageAvailable()) {
    onboardingStorage.set(INTENTIONS_KEY, JSON.stringify(intentions));
  }
}

export const EXPERIENCE_LEVEL_IDS = ["beginner", "regular", "guide"] as const;

export type ExperienceLevelId = (typeof EXPERIENCE_LEVEL_IDS)[number];

export function isExperienceLevelId(
  value: unknown,
): value is ExperienceLevelId {
  return (EXPERIENCE_LEVEL_IDS as readonly string[]).includes(value as string);
}

export function getExperienceLevel(): ExperienceLevelId | undefined {
  if (!isStorageAvailable()) {
    return undefined;
  }

  const value = onboardingStorage.getString(EXPERIENCE_LEVEL_KEY);
  return isExperienceLevelId(value) ? value : undefined;
}

export function setExperienceLevel(level: ExperienceLevelId): void {
  if (isStorageAvailable()) {
    onboardingStorage.set(EXPERIENCE_LEVEL_KEY, level);
  }
}

export const SOUNDSCAPE_IDS = [
  "amber-dawn",
  "silent-river",
  "misty-forest",
] as const;

export type SoundscapeId = (typeof SOUNDSCAPE_IDS)[number];

export function isSoundscapeId(value: unknown): value is SoundscapeId {
  return (SOUNDSCAPE_IDS as readonly string[]).includes(value as string);
}

export function getSoundscape(): SoundscapeId | undefined {
  if (!isStorageAvailable()) {
    return undefined;
  }

  const value = onboardingStorage.getString(SOUNDSCAPE_KEY);
  return isSoundscapeId(value) ? value : undefined;
}

export function setSoundscape(soundscape: SoundscapeId): void {
  if (isStorageAvailable()) {
    onboardingStorage.set(SOUNDSCAPE_KEY, soundscape);
  }
}
