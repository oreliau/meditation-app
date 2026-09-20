import type { SessionStore } from "@meditation-app/timer";

// Widgets and Live Activities are native-only. Keep the shared root layout
// wired the same way on web without importing @expo/ui/swift-ui or
// expo-widgets into the web bundle.
export function useSessionWidgets(_store: SessionStore): void {}
