# iOS TestFlight preview lane

The `fastlane preview` lane builds the current `main` commit locally on macOS and uploads it to the internal TestFlight group. It is intentionally independent of the GitHub Actions orchestration planned in later tickets.

## One-time Mac setup

1. Install Xcode and accept its license.
2. Install Ruby dependencies with `bundle install`.
3. Install CocoaPods if it is not already available: `gem install cocoapods`.
4. Create the iOS app in App Store Connect and configure its internal TestFlight testers.
5. Configure Xcode automatic signing for the Apple Developer team in `IOS_TEAM_ID`.
6. Set up App Store Connect authentication. Fastlane may use an App Store Connect API key or the normal `FASTLANE_USER` authentication flow. Keep the key file and any session material outside the repository.

The final bundle identifier is supplied by `IOS_BUNDLE_IDENTIFIER`; this lets issue #26 establish the store-owned identifier without changing this lane. Until then, the lane rejects the placeholder identifier rather than uploading to an unintended app.

## Run a preview

```sh
export IOS_BUNDLE_IDENTIFIER="com.oreliaukmz.meditationapp"
export IOS_TEAM_ID="YOUR_APPLE_TEAM_ID"
export FASTLANE_USER="your-apple-id@example.com"
bundle exec fastlane ios preview PREVIEW_SHA="$(git rev-parse origin/main)" IOS_BUILD_NUMBER="$(date -u +%Y%m%d%H%M)"
```

For the eventual GitHub Actions runner, pass `PREVIEW_SHA` explicitly and use `GITHUB_RUN_NUMBER` (or another repository-wide monotonic number) for `IOS_BUILD_NUMBER`. The lane checks out the SHA before running Expo prebuild, so the uploaded binary is tied to the requested merge.

## Manual validation blocker

This lane cannot be validated end-to-end in the current workspace because the Apple Developer team, store-owned bundle identifier, signing access, and App Store Connect credentials are not present. The first validation must be performed on the configured Mac after issue #26's one-time store setup.
