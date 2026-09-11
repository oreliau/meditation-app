import { createMMKV } from "react-native-mmkv";

export const themeStorage = createMMKV({ id: "aura-theme" });

export const THEME_OVERRIDE_KEY = "themeOverride";

export type ThemeOverride = "light" | "dark";

export function getPersistedThemeOverride(): ThemeOverride | undefined {
  // Expo Router's static web output evaluates this module server-side (no
  // `window`) to prerender each route. MMKV's web backend reads
  // `window.localStorage` lazily on first access and throws outside a DOM,
  // so skip the read there — the real client bundle re-evaluates this in
  // the browser and picks up the persisted value normally.
  if (typeof window === "undefined") {
    return undefined;
  }

  const value = themeStorage.getString(THEME_OVERRIDE_KEY);

  return value === "light" || value === "dark" ? value : undefined;
}
