import { createMMKV } from "react-native-mmkv";
import { isStorageAvailable } from "@/storage";

export const themeStorage = createMMKV({ id: "aura-theme" });

export const THEME_OVERRIDE_KEY = "themeOverride";

export type ThemeOverride = "light" | "dark";

export function getPersistedThemeOverride(): ThemeOverride | undefined {
  if (!isStorageAvailable()) {
    return undefined;
  }

  const value = themeStorage.getString(THEME_OVERRIDE_KEY);

  return value === "light" || value === "dark" ? value : undefined;
}
