# Cross-platform E2E smoke and screenshot matrix

We use Maestro for Android, iOS/iPad, and the Chromium web browser, with one shared principal journey and evidence-only screenshots. Chromium and Android gate pull requests; iPad and iPhone 18 Pro run manually or on release using the existing macOS runner. This keeps fast CI feedback while preserving explicit Apple-device coverage, and avoids coupling simulator smoke tests to EAS remote builds.
