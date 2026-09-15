# Android preview lane

`fastlane android preview commit:<sha>` generates the Expo SDK 57 Android project, builds a signed release AAB on the local Mac, and uploads it to Google Play Internal Testing.

The lane is intentionally configurable for the private-distribution setup in issue #26:

```bash
export ANDROID_PACKAGE_NAME=com.oreliaukmz.meditationapp
export ANDROID_KEYSTORE_PATH=/secure/path/preview-upload.jks
export ANDROID_KEYSTORE_PASSWORD='...'
export ANDROID_KEY_ALIAS='...'
export ANDROID_KEY_PASSWORD='...'
export GOOGLE_PLAY_JSON_KEY_PATH=/secure/path/google-play-service-account.json
export GOOGLE_PLAY_TRACK=internal # optional; defaults to internal
export GITHUB_RUN_NUMBER=123       # optional; otherwise local state is used

bundle exec fastlane android preview commit:$(git rev-parse HEAD)
```

`GOOGLE_PLAY_JSON_KEY_DATA` may be used instead of `GOOGLE_PLAY_JSON_KEY_PATH`. Keep both the keystore and service-account key outside the repository and back them up encrypted. `ANDROID_PREVIEW_STATE_FILE` can relocate the local monotonic version-code record.

Before issue #26 is completed, store app identity, Play Console access, tester configuration, keystore, and service-account credentials are unavailable. Consequently, upload validation is blocked; the lane will fail during preflight with an actionable message until those values are configured.
