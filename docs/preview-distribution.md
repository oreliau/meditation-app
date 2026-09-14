# Private mobile preview distribution

This app is configured for private previews with the same permanent application
identifier on both platforms:

- iOS bundle identifier: `com.oreliaukmz.meditationapp`
- Android application ID: `com.oreliaukmz.meditationapp`
- Current marketing version: `1.0.0`

The repository is an Expo SDK 57 managed project. The native `ios/` and
`android/` directories are generated during a native build and are intentionally
not committed. Fastlane and the local Mac runner will be added in later tickets.

## One-time human setup

Complete these steps before attempting an automated preview upload. They require
account access and cannot be completed safely by an agent.

### Apple

1. Confirm Apple Developer Program membership for the team that owns the app.
2. In App Store Connect, create an iOS app using bundle ID
   `com.oreliaukmz.meditationapp`. Use `meditation-app` (or the chosen store
   name) consistently for the app record.
3. Create an internal TestFlight tester group and add the intended testers.
4. On the Mac that will build the app, install a distribution signing
   certificate and a provisioning profile for this bundle ID. Keep the signing
   team and certificate associated with the App Store Connect account.
5. For unattended uploads, create an App Store Connect API key with the
   narrowest role that can upload builds. Record its issuer ID and key ID; keep
   the `.p8` file private.

### Google Play

1. Confirm Play Console access and create the Android app using application ID
   `com.oreliaukmz.meditationapp`.
2. Complete the Play Console onboarding required before an internal release,
   including the app details and required declarations.
3. Create an Internal testing track and add the intended testers.
4. Create or confirm the Android upload keystore. Back up the keystore and its
   passwords before the first upload; losing the upload credentials can block
   future updates.
5. Create a Google Play service account with the minimum release-management
   permissions needed by Fastlane, invite it in Play Console, and download its
   JSON key. Keep the JSON key private.

## Credential storage and recovery

Store credentials on the build Mac using its keychain and Fastlane's supported
local credential mechanisms. Do not commit certificates, provisioning profiles,
keystores, API keys, service-account JSON, or passwords to this repository.

Keep an encrypted backup in the team's approved password manager or encrypted
offline storage. The backup should include:

- Apple API key (`.p8`), issuer ID, key ID, team ID, and certificate/profile
  recovery instructions.
- Android upload keystore, alias, passwords, service-account JSON, and the
  Play Console service-account invitation details.
- The date, owner, and a tested recovery procedure.

Test recovery on a separate Mac before relying on the pipeline. Rotate revoked
or exposed credentials immediately and update the backup at the same time.

The repository already ignores common native credential extensions and local
environment files. Review `git status` before every commit to ensure no secret
material has been staged.

## Readiness checks

From the repository root, a human with the required local tooling can verify the
resolved identifiers without contacting either store:

```sh
pnpm exec expo config --type public
```

The output must show both identifiers above. A native build will generate the
`ios/` and `android/` projects from `app.json`; generated projects must not be
hand-edited or committed unless the build strategy explicitly changes.

## Outstanding ticket #26 prerequisites

This repository cannot verify or provide the following store-side prerequisites:

- App Store Connect app record and TestFlight internal tester group.
- Google Play app record and Internal testing track/tester group.
- Apple distribution credentials and App Store Connect API key.
- Android upload keystore and Google Play service-account key.
- Encrypted credential backups and a successful recovery test.

These are manual prerequisites for the human owner. Until they are complete,
issue #26 remains open and no preview upload should be considered operational.
