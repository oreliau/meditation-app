// Native (iOS/Android): fonts are statically linked at build time via
// app.json's expo-font plugin (assets/fonts/*.ttf), so they're already
// available when JS starts — no runtime loading, no splash-screen wait.
// Web has no equivalent static-linking step, so it uses useLoadFonts.web.ts
// instead (Metro/Expo picks the right one per platform automatically).
export function useLoadFonts(): boolean {
  return true;
}
