#!/bin/bash
# Claude Code status line
# Shows across multiple rows: model + cwd, git repo:branch, context tokens used, and rate limits (5h/7d)

input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
cwd=$(echo "$input" | jq -r '.workspace.current_dir')
dir_display="${cwd/#$HOME/~}"

# --- Git repo name + branch (skip optional locks to avoid contention) ---
git_info=""
if git -C "$cwd" --no-optional-locks rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  repo_root=$(git -C "$cwd" --no-optional-locks rev-parse --show-toplevel 2>/dev/null)
  repo_name=$(basename "$repo_root")
  branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null)
  if [ -n "$branch" ]; then
    git_info="${repo_name}:${branch}"
  else
    git_info="${repo_name}"
  fi
fi

# --- Context window usage, shown as a compact raw token count (e.g. 120k) ---
ctx_tokens=$(echo "$input" | jq -r '.context_window.total_input_tokens // empty')
ctx_str=""
if [ -n "$ctx_tokens" ]; then
  ctx_str=$(awk -v t="$ctx_tokens" 'BEGIN {
    if (t >= 1000000) printf "%.1fM", t / 1000000;
    else if (t >= 1000) printf "%.0fk", t / 1000;
    else printf "%d", t;
  }')
fi

# --- Claude.ai subscription rate limits (5h / 7d) ---
five=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
week=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty')

rate_str=""
if [ -n "$five" ]; then
  rate_str="5h:$(printf '%.0f' "$five")%"
fi
if [ -n "$week" ]; then
  if [ -n "$rate_str" ]; then
    rate_str="${rate_str} 7d:$(printf '%.0f' "$week")%"
  else
    rate_str="7d:$(printf '%.0f' "$week")%"
  fi
fi

# --- Colors (kept subtle since Claude Code renders the status line dimmed) ---
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
MAGENTA='\033[35m'
DIM='\033[2m'
RESET='\033[0m'

parts=()
parts+=("${CYAN}${model}${RESET} ${DIM}${dir_display}${RESET}")

if [ -n "$git_info" ]; then
  parts+=("${GREEN}${git_info}${RESET}")
fi

if [ -n "$ctx_str" ]; then
  parts+=("${YELLOW}ctx:${ctx_str}${RESET}")
fi

if [ -n "$rate_str" ]; then
  parts+=("${MAGENTA}${rate_str}${RESET}")
fi

# Keep each logical group on its own row so the status line stays readable in
# narrow terminals. Empty optional groups are omitted rather than rendered as
# blank rows.
printf "%b\n" "${parts[0]}"

if [ -n "$git_info" ]; then
  printf "%b\n" "${parts[1]}"
fi

if [ -n "$ctx_str" ] || [ -n "$rate_str" ]; then
  details=""
  if [ -n "$ctx_str" ]; then
    details="${YELLOW}ctx:${ctx_str}${RESET}"
  fi
  if [ -n "$rate_str" ]; then
    if [ -n "$details" ]; then
      details="${details} ${DIM}|${RESET} "
    fi
    details="${details}${MAGENTA}${rate_str}${RESET}"
  fi
  printf "%b\n" "$details"
fi
