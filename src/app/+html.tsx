import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";
import "../unistyles";

// Root HTML wrapper for Expo Router's static web output (app.config.js's
// web.output: "static"). Unistyles must be initialized here too, since each
// static page is resolved through this file. See:
// https://docs.expo.dev/router/reference/static-rendering/#root-html
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>Meditation App (by Oréliau Koumedzro)</title>
        <meta
          name="description"
          content="Meditation App by Oréliau Koumedzro"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
