# Mac mobile preview runner

The `Mobile private preview` workflow runs on a self-hosted Mac and is triggered
by every push to `main`. A merge while the Mac is asleep or offline remains
queued by GitHub until the runner is available. The workflow cancels obsolete
queued or running work so the latest `main` commit wins.

The iOS and Android jobs are independent and each checks out the exact requested
commit before invoking its merged Fastlane lane:

- iOS: `bundle exec fastlane ios preview`
- Android: `bundle exec fastlane android preview`

## One-time Mac setup

1. Use a dedicated macOS user for the runner where practical. Keep the Mac
   logged in when previews are expected to run, and disable automatic logout.
2. Install Xcode, its command-line tools, Android Studio/SDK, Node, pnpm, Ruby,
   Bundler, and Java. Accept the Xcode license and ensure the required simulator
   and Android SDK components are installed.
3. Install the repository's dependencies and verify `bundle install` succeeds.
4. Install the GitHub Actions self-hosted runner from the repository's
   **Settings → Actions → Runners** page. Never copy a registration token into
   this repository or documentation.
5. Add the custom runner label `preview-runner`. Keep the platform label
   `macOS`, which is used by the workflow's `runs-on` selector.
6. Configure the runner service using GitHub's generated command for this Mac.
   The service must run as the signed-in build user so it can access Xcode,
   keychain signing identities, Android tooling, and the local Fastlane files.
7. Provide the credential environment variables expected by the Fastlane lanes
   through the runner service's environment, not by committing them:
   `APP_STORE_CONNECT_API_KEY_PATH`, `IOS_TEAM_ID`, `ANDROID_KEYSTORE_PATH`,
   `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
   `ANDROID_KEY_PASSWORD`, and `GOOGLE_PLAY_JSON_KEY_PATH`.
8. Optionally set the repository variable `PREVIEW_STATE_FILE` to an absolute
   path. Otherwise the runner records state at
   `~/.meditation-app/preview-runner-state.json`.

## Start, stop, and restart

Run the generated runner service commands from the runner directory. GitHub's
runner setup prints the exact `svc.sh` commands for the installed version:

```sh
./svc.sh status
./svc.sh start
./svc.sh stop
./svc.sh restart
```

After a macOS reboot or account change, confirm the service is running and the
runner appears **Idle** in GitHub repository settings. If the Mac is asleep or
offline, no local watcher is needed; the GitHub Actions job remains queued.

## Local safety record

The workflow updates the state file under the build user's home directory. It
records the latest requested commit and the per-platform status, plus the latest
successful commit. The update uses a lock and atomic replacement so the iOS and
Android jobs cannot corrupt the file when they finish together.

The record is operational state, not a credential. Back it up only through the
approved encrypted backup process; never commit it to the repository.

## Troubleshooting

- **Job queued:** wake/log into the Mac, verify the runner service and the
  `preview-runner` label.
- **Checkout mismatch:** inspect `PREVIEW_SHA` in the workflow run; the jobs
  explicitly check out that SHA and pass it to Fastlane.
- **Credential failure:** verify the runner service user's environment and
  keychain/filesystem access without printing secret values.
- **Stale result:** open the workflow run and compare its SHA with the state
  file's `requested_commit`; a newer merge may have cancelled this run.
