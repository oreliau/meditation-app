# E2E device matrix

The principal meditation journey is exercised with the same assertions on every target:

| Target | Runner | Tool | PR gate | Submission screenshots |
| --- | --- | --- | --- | --- |
| Chromium | GitHub-hosted Ubuntu | Maestro web browser | Yes | Yes |
| Android Pixel emulator | GitHub-hosted Ubuntu | Maestro | Yes | Yes |
| iPad simulator | Self-hosted macOS | Maestro | Manual/release | Yes |
| iPhone 18 Pro simulator | Self-hosted macOS | Maestro | Manual/release | Yes |

The Apple job must fail during preflight when the requested simulator or runtime is unavailable. It must not silently substitute another device for submission screenshots. Generated images are workflow artifacts, not committed source files.

Screenshot names are stable and ordered: `01-welcome`, `02-home`, `03-running`, and `04-completed`.
