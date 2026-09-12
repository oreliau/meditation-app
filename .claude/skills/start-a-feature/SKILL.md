---
name: start-a-feature
description: Launch a fresh Docker sandbox (via `sbx`) running the claude-sonnet kit to build a feature end-to-end, seeded with a /grill-with-docs prompt. Use when the user wants to kick off a new feature, task, or fix in an isolated sandboxed agent session instead of doing it in the current session.
argument-hint: "<feature-name> <what to build>"
---

Agent-callable equivalent of running `start-a-feature.sh` by hand: gathers the same inputs through conversation instead of shell `read` prompts, sharpens them into a draft ADR before anything runs in a sandbox, then hands that ADR to a fresh sandboxed agent to implement.

## 1. Get the feature name

If a name was passed as an argument, use it (kebab-case; becomes the sandbox `--name` and the draft ADR's filename). Otherwise ask the user for one directly.

## 2. Get the grill-with-docs prompt

Ask the user for the prompt to seed the `grill-with-docs` interview with: a short description of what to build for this feature. This is the `args` passed to the Skill call in the next step, not the feature name from step 1.

## 3. Interview and draft the ADR

Call the Skill tool for `grill-with-docs`, passing the prompt from step 2 as `args`, to interview the user about this feature (it in turn calls `grilling` then `domain-modeling`). Tell it explicitly: this ADR is a **temporary draft** for handing off to a sandboxed `/implement` run, not a permanent entry in the numbered ADR sequence — write it to `docs/adr/DRAFT-<feature-name>.md` instead of wherever it would normally place a resolved decision. `docs/adr/` is already gitignored in this repo, so the draft never gets committed.

Stop here if the user abandons the interview; don't proceed to a sandbox with a half-finished ADR.

## 4. Offer MCPs

Run `sbx mcp ls` via Bash and drop the header row. If it returns entries, ask the user (multi-select) which to enable for this sandbox; skip the question entirely if the list is empty. Join the selected names with commas for `--static-mcp`.

## 5. Run it

Read the draft ADR's content (don't just reference its path) and pass it inline as the `/implement` argument:

```
sbx run ./sandbox/kits/claude-sonnet -t claude-code-pnpm:v1 --clone --name "<feature-name>" [--static-mcp <selected>] . -- "/implement

<full contents of docs/adr/DRAFT-<feature-name>.md>"
```

Build this as a real argument (e.g. a bash array, or a variable expanded with `"$PROMPT"`), not with `eval` on a flattened string — the ADR is markdown and may contain backticks, `$`, or quotes that would otherwise be re-interpreted as shell syntax. Echo the constructed command before running it. It starts a long-lived container, so run it via Bash with `run_in_background: true`. Tell the user the sandbox name and how to follow up: `sbx exec -it <feature-name> bash` to shell in, `sbx port <feature-name> --publish <host>:<container>` to expose a port.

## Notes

- The kit path is `sandbox/kits/claude-sonnet` (see its `spec.yaml`) — not `./kits/claude-sonnet`, an old path referenced in `Docker-sbx.md` that no longer exists in this repo.
- The sandbox's own `/implement` skill (bundled at `sandbox/kits/claude-sonnet/files/workspace/.agents/skills/implement`) expects a spec or tickets; the inlined ADR content satisfies that directly, without the sandboxed agent needing to read the file itself.
- The draft ADR is still cloned into the sandbox at `docs/adr/DRAFT-<feature-name>.md` as a reference artifact, even though its content is now inlined rather than pointed to.
- If the feature name looks ambiguous, or the ADR implies something destructive, confirm the constructed command with the user before running it.
