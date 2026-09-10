import "@/unistyles";

import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";
import { useServerUnistyles } from "react-native-unistyles/server";

/**
 * Web-only server component that wraps every route during Expo Router's static
 * rendering (`web.output: "static"` in app.json).
 *
 * Unistyles requires its collected styles + runtime state to be flushed into the
 * static HTML `<head>` so the first paint already has the correct theme and there
 * is no flash of unstyled content. `useServerUnistyles()` emits those `<style>` /
 * `<script>` tags and hydrates the client on mount.
 *
 * See https://unistyl.es/v3/guides/expo-router/#expo-router-web---static-rendering
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Disable body scrolling on web so the root <ScrollView> behaves like native. */}
        <ScrollViewStyleReset />

        {/* Flush Unistyles styles + runtime state into the static HTML. */}
        {useServerUnistyles()}
      </head>
      <body>{children}</body>
    </html>
  );
}
