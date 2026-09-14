# Mobile preview recovery

The mobile preview workflow runs independent iOS and Android jobs on the
self-hosted Mac runner. Each platform attempts its Fastlane lane up to three
times. A later merge cancels obsolete work through the workflow concurrency
group, leaving the newest `main` commit as the only preview target.

## Observability

Each platform publishes a separate commit status named `mobile-preview / iOS`
or `mobile-preview / Android`. The status links to the workflow run and ends as
success or failure. The job summary records the exact preview commit. The
runner state file records requested, succeeded, and failed platform outcomes.

Failures retain the normal GitHub Actions logs. Retry attempts never print
credential values, and commit statuses, summaries, and macOS notifications
contain only the platform, outcome, commit, and workflow URL.

## Mac availability and reruns

When the Mac is asleep or offline, the self-hosted jobs remain queued. Wake or
log in to the Mac and ensure the `preview-runner` service is running; GitHub
Actions then dispatches the queued latest run. Do not start a build from an
arbitrary checkout: each job checks out `PREVIEW_SHA` before invoking Fastlane.

To recover a failed preview, open the failed workflow run and use **Re-run
failed jobs**. To preview a specific commit, use **Run workflow** and provide
its full SHA in the `sha` input. Confirm the two platform statuses separately;
one platform can succeed while the other is retried or failed.

If credentials or signing material are missing, fix the Mac configuration and
rerun the affected job. Never add those values to workflow inputs, logs, state
files, summaries, notifications, or the repository.
