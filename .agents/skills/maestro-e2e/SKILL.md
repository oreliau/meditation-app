---
name: maestro-e2e
description: Use when creating, updating, debugging, or reviewing Maestro E2E flows for Android, iOS, iPad, or Chromium web browser targets.
---

# Maestro E2E

Use Maestro as the single E2E driver for this repository's native and web targets. Keep the principal journey equivalent across platforms and preserve the screenshot artifact contract.

## Flow rules

- Put mobile flows in `.maestro/` with the target app's bundle/package `appId`.
- Put browser flows in `.maestro/` with a top-level `url:` before the `---` command separator. Use `maestro test --platform web <flow>`; start the local browser with `maestro start-device --platform web` when running outside Maestro Cloud.
- Reset state at the start of an isolated scenario with `launchApp: { clearState: true }`. Validate persistence by launching again without clearing state.
- Prefer visible text, accessibility roles, and stable `testID` values. Add a `testID` only when the accessible identity is ambiguous or changes during a state transition.
- Use Maestro's built-in waiting (`assertVisible`, `extendedWaitUntil`) for asynchronous UI. Keep waits tied to observable product state.
- Capture named states with `takeScreenshot`. Use the repository sequence `01-welcome`, `02-home`, `03-running`, and `04-completed`, prefixed by the target when the artifact directory combines targets.

## Repository contract

The principal flow is: complete the four-step Onboarding, reach Home, select the existing 6-second duration, start a Session, observe natural Completed feedback, dismiss it, verify Today’s practice, and relaunch to verify Onboarding persistence.

Keep Chromium on the same Maestro flow contract as Android/iOS. Chromium and Android run as PR gates; iPad and iPhone 18 Pro run in the manual/release submission workflow. Fail Apple preflight when the requested simulator is unavailable instead of substituting a device.

Run the relevant flow directly while developing:

```bash
maestro start-device --platform web
pnpm test:e2e:web
pnpm test:e2e:android
pnpm test:e2e:ios
```

For the full workflow and device matrix, read [docs/e2e-device-matrix.md](../../../docs/e2e-device-matrix.md). For the platform reference, use the [Maestro web browser documentation](https://docs.maestro.dev/get-started/supported-platform/web-browser).

Completion means the flow is syntactically valid, selectors map to the current accessibility tree, screenshots have stable names, and the relevant local or CI device run passes.
