// Expo Router's static web output evaluates modules server-side (no
// `window`) to prerender each route. MMKV's web backend touches
// `window.localStorage` lazily on first access and throws outside a DOM,
// so guard every read *and write* with this — the real client bundle
// re-evaluates in the browser and uses storage normally.
export function isStorageAvailable(): boolean {
  return typeof window !== "undefined";
}
