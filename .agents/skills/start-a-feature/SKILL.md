---
name: start-a-feature
description: Launch a fresh Docker sandbox (via `sbx`) running the codex-luna kit to build a feature end-to-end, seeded with a $grill-with-docs prompt. Use when the user wants to kick off a new feature, task, or fix in an isolated sandboxed agent session instead of doing it in the current session.
argument-hint: "<what to build>"
disable-model-invocation: true
---

## 1. Find the feature name

Find name for the feature (kebab-case; becomes the sandbox `--name` and the draft ADR's filename). 

## 2. Get the grill-with-docs prompt

Ask the user for the prompt to seed the `grill-with-docs` interview with: a short description of what to build for this feature. 

## 3. Interview and draft the ADR

Call the Skill tool for `grill-with-docs`, passing the prompt from step 2 as `args`, to interview the user about this feature (it in turn calls `grilling` then `domain-modeling`). Tell it explicitly: this ADR is a **temporary draft** for handing off to a sandboxed `$implement` run, not a permanent entry in the numbered ADR sequence — write it to `docs/adr/DRAFT-<feature-name>.md` instead of wherever it would normally place a resolved decision. `docs/adr/` is already gitignored in this repo, so the draft never gets committed.

Stop here if the user abandons the interview; don't proceed to a sandbox with a half-finished ADR.

## 4. Break the ADR into tickets

Call the Skill tool for `to-tickets`, passing the draft ADR as context (it reads the issue tracker and triage-label conventions from `docs/agents/`, per this repo's GitHub issue tracker). Let it run its normal flow: draft tracer-bullet slices, quiz the user on granularity and blocking edges, then publish one GitHub issue per ticket in dependency order with the `ready-for-agent` label.

For a small feature this will often collapse to a single issue — `to-tickets` sizes each ticket to fit a single fresh context window, which is also the size of one sandbox session. For a larger feature it'll produce several issues with blocking edges; that's fine, the sandboxed agent works the frontier itself (see step 6).

Note the issue number(s) `to-tickets` created; you'll need them for the sandbox prompt. Stop here if the user abandons the ticket review; don't hand a half-approved breakdown to a sandbox.

## 5. Offer MCPs

Run `sbx mcp ls` via Bash and drop the header row. If it returns entries, ask the user (multi-select) which to enable for this sandbox; skip the question entirely if the list is empty. Join the selected names with commas for `--static-mcp`.

## 6. Run it

Don't inline the ADR or ticket bodies — pass only a reference to the issue(s), letting the sandboxed agent fetch them itself:

```
sbx run ./sandbox/kits/codex-luna -t codex-pnpm:v1 --clone --name "<feature-name>" [--static-mcp <selected>] . -- "@implement Work GitHub issue #<n1>[, #<n2>, ...] per docs/agents/issue-tracker.md (gh issue view <n> --comments to fetch each). If there are several, respect their blocking edges and work the frontier in order, closing each issue as it's done."
```

Echo the constructed command before running it. It starts a long-lived container, so run it via Bash with `run_in_background: true`. Tell the user the sandbox name and how to follow up: `sbx exec -it <feature-name> bash` to shell in, `sbx port <feature-name> --publish <host>:<container>` to expose a port.

## Notes

- The sandbox already has a `GH_TOKEN` injected for `github.com`/`api.github.com` (see `spec.yaml`'s `credentials`), so `gh issue view` works inside it with no extra setup.
- The sandbox's own `@implement` skill (bundled at `sandbox/kits/Codex-sonnet/files/workspace/.agents/skills/implement`) expects a spec or tickets; a GitHub issue reference satisfies that once the agent fetches it, same as it would for any other tracker-driven work in this repo.
- The draft ADR is still cloned into the sandbox at `docs/adr/DRAFT-<feature-name>.md` as background reference, but the sandboxed agent's actual task comes from the published issue(s), not this file.
- Publishing to `to-tickets` creates real, permanent GitHub issues (not gitignored drafts) — if the user is only sketching an idea and might abandon it, say so before step 4 rather than after issues already exist.
- If the feature name looks ambiguous, or the tickets imply something destructive, confirm the constructed command with the user before running it.
