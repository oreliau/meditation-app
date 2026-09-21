const soundscapeSources: Record<string, number> = {
  "amber-dawn": require("../assets/leberch-meditation-513747.mp3"),
  "silent-river": require("../assets/monume-meditation-music-577979.mp3"),
  "misty-forest": require("../assets/solarflex-meditation-meditation-music-589064.mp3"),
};

export type SoundscapeId = keyof typeof soundscapeSources;

export const DEFAULT_SOUNDSCAPE_ID: SoundscapeId = "amber-dawn";

export function isSoundscapeId(
  value: string | undefined,
): value is SoundscapeId {
  return value !== undefined && value in soundscapeSources;
}

export function getSoundscapeSource(id: SoundscapeId): number {
  return soundscapeSources[id];
}
