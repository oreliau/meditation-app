#!/usr/bin/env bash

set -uo pipefail

max_attempts="${PREVIEW_RETRY_ATTEMPTS:-3}"
if ! [[ "$max_attempts" =~ ^[1-9][0-9]*$ ]]; then
  echo "PREVIEW_RETRY_ATTEMPTS must be a positive integer" >&2
  exit 2
fi

if (($# == 0)); then
  echo "A preview command is required" >&2
  exit 2
fi

last_exit_code=1
for ((attempt = 1; attempt <= max_attempts; attempt++)); do
  echo "Preview ${PREVIEW_PLATFORM:-unknown} attempt ${attempt}/${max_attempts}"
  "$@"
  last_exit_code=$?
  if ((last_exit_code == 0)); then
    exit 0
  fi

  if ((attempt < max_attempts)); then
    delay=$((10 * attempt))
    echo "Preview attempt failed with exit code ${last_exit_code}; retrying in ${delay}s." >&2
    sleep "$delay"
  fi
done

echo "Preview failed after ${max_attempts} attempts." >&2
exit "$last_exit_code"
