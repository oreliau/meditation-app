---
name: pull-request
description: Create, check, and merge GitHub pull requests on oreliau/meditation-app via `gh` — open a PR from the current branch, check CI/status-check state, arm squash auto-merge that fires once checks go green, or merge/cancel directly. Use when the user wants to open a PR, check whether checks are passing, set up "merge when CI is green" / auto-merge, or merge a PR now.
---

# Pull request

Operations for this repo's PRs through `gh`, run from the branch's worktree.

## Create a PR

1. Push the branch if it isn't tracking a remote yet: `git push -u origin HEAD`.
2. Draft a title and body from the branch's commits. Title follows this repo's conventional-commit style (`type(scope): summary`, matching `git log`) — see the top-level PR-creation instructions for the full title/body/test-plan format.
3. `gh pr create --title "<title>" --body "<body>"`.

## Arm squash auto-merge on green CI

`gh pr merge <number-or-branch> --auto --squash` marks a PR to squash-merge itself once its required checks pass. Two repo-specific catches, check both before relying on it:

1. **Auto-merge must be allowed on the repo.** Check: `gh api repos/oreliau/meditation-app --jq .allow_auto_merge`. It is currently `false` — `gh pr merge --auto` fails outright until someone flips it. This is a repo-wide setting, so confirm with the user before changing it: `gh api -X PATCH repos/oreliau/meditation-app -f allow_auto_merge=true`.
2. **`main` needs required status checks, or "auto-merge" fires immediately instead of waiting for CI.** Check: `gh api repos/oreliau/meditation-app/branches/main/protection` — a 404 means no protection exists yet, so GitHub has nothing to block the merge on. The checks worth requiring are the jobs in `.github/workflows/`: `pr-checks.yml` runs `Typecheck`, `Lint (biome)`, `Tests`, `expo-doctor`, `React Compiler healthcheck`, `Expo prebuild (native config)`, `Web static export`; `react-doctor.yml` runs `React Doctor`. This is also a repo-wide change — confirm with the user, then set it (trim the `checks` list to whichever of the above should actually gate merges):

   ```bash
   gh api -X PUT repos/oreliau/meditation-app/branches/main/protection --input - <<'EOF'
   {
     "required_status_checks": {
       "strict": true,
       "checks": [
         { "context": "Typecheck" },
         { "context": "Lint (biome)" },
         { "context": "Tests" }
       ]
     },
     "enforce_admins": false,
     "required_pull_request_reviews": null,
     "restrictions": null
   }
   EOF
   ```

3. Once both are true: `gh pr merge <number-or-branch> --auto --squash [-d]` (`-d` also deletes the branch after merge). To cancel: `gh pr merge <number-or-branch> --disable-auto`.

## Check CI / PR status

- `gh pr checks <number-or-branch>` — pass/fail state of every check on the PR.
- `gh pr view <number-or-branch> --json mergeable,mergeStateStatus,autoMergeRequest` — merge eligibility and whether auto-merge is already armed.

## Merge now (skip auto-merge)

`gh pr merge <number-or-branch> --squash` merges immediately. GitHub still blocks it on any *required* check that's failing, but nothing blocks it if the branch has no required checks configured (see catch 2 above) — so an immediate merge can go out before CI finishes.

## Notes

- Squash is this repo's default merge style (`allow_squash_merge: true`); merge and rebase are also enabled on the repo, but default to squash unless the user says otherwise.
- The two `gh api` calls above change repo-wide settings visible to every collaborator — always confirm with the user first rather than flipping them mid-task.
