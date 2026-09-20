# Workspace module boundaries

The meditation app is being organized as a pnpm workspace with an Expo application composed from private `@meditation-app/*` capability and product packages. Packages expose only their `src/index.ts` public API, keep platform adapters behind that boundary, and provide a typed `app.ts` Expo configuration contribution; the application remains responsible for routes and composition. This preserves a runnable incremental migration while preventing infrastructure packages from becoming a catch-all shared layer.

## Consequences

- Package dependencies flow from the app to product modules to capability modules.
- The notifications module owns local reminders and Session-end alerts, but not a remote push backend.
- Package-local tests run through the workspace test command, with app-level integration and E2E coverage retained.
