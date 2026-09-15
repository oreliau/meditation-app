#!/usr/bin/env bash
# Create the eval home directory tree for a run.
#
# Usage: make-home.sh <home> <iteration> <num-evals> [configs]
#   home   Run root, e.g. /private/tmp/expo-skill-eval-<skill>
#   iteration   Iteration folder name, e.g. "iteration-1"
#   num-evals   Number of eval cases; creates eval-0 .. eval-(N-1)
#   configs     Space- or comma-separated config names
#               (default: "with_skill without_skill")
#
# Creates <home>/trigger-evals/scratch and, per eval x config,
# <home>/<iteration>/eval-<i>/<config>/outputs. Run this once at the
# start of a run instead of ad-hoc `mkdir` so the call is covered by the
# skill's `Bash(bash *expo-skill-eval/scripts/*)` rule (the mkdir calls
# inside run as children of this script and need no permission of their own).
set -euo pipefail

WORKSPACE="${1:?usage: make-home.sh <home> <iteration> <num-evals> [configs]}"
ITERATION="${2:?usage: make-home.sh <home> <iteration> <num-evals> [configs]}"
NUM_EVALS="${3:?usage: make-home.sh <home> <iteration> <num-evals> [configs]}"
CONFIGS="${4:-with_skill without_skill}"
CONFIGS="${CONFIGS//,/ }"

mkdir -p "$WORKSPACE/trigger-evals/scratch"
for ((i = 0; i < NUM_EVALS; i++)); do
  for cfg in $CONFIGS; do
    mkdir -p "$WORKSPACE/$ITERATION/eval-$i/$cfg/outputs"
  done
done

echo "workspace ready: $WORKSPACE/$ITERATION ($NUM_EVALS evals x [$CONFIGS])"
