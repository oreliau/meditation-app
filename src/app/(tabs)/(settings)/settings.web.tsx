import { Redirect } from "expo-router";

// Settings (reminders) is mobile-only. Expo Router picks this file on web
// instead of settings.tsx, so the route effectively doesn't exist there —
// anyone landing on /settings is sent home.
export default function SettingsScreen() {
  return <Redirect href="/" />;
}
