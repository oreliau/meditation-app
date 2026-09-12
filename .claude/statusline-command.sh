#!/bin/bash
# Claude Code status line
# Shows model + cwd, git repo:branch, context tokens used, and rate limits (5h/7d).
# The layout adapts to the terminal width so it stays compact without wrapping.

input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name // empty')
cwd=$(echo "$input" | jq -r '.workspace.current_dir // empty')
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

# --- Responsive layout helpers ---
terminal_width() {
  local width="${COLUMNS:-}"

  if ! [[ "$width" =~ ^[1-9][0-9]*$ ]]; then
    width=""
  fi

  if [ -z "$width" ] && command -v tput >/dev/null 2>&1; then
    width=$(tput cols 2>/dev/null || true)
  fi

  if ! [[ "$width" =~ ^[1-9][0-9]*$ ]]; then
    width=80
  fi

  printf '%s' "$width"
}

truncate_left() {
  local value="$1"
  local max_width="$2"

  if [ "${#value}" -le "$max_width" ]; then
    printf '%s' "$value"
  elif [ "$max_width" -le 3 ]; then
    printf '%s' "${value: -$max_width}"
  else
    printf '...%s' "${value: -$((max_width - 3))}"
  fi
}

truncate_right() {
  local value="$1"
  local max_width="$2"

  if [ "${#value}" -le "$max_width" ]; then
    printf '%s' "$value"
  elif [ "$max_width" -le 3 ]; then
    printf '%s' "${value:0:$max_width}"
  else
    printf '%s...' "${value:0:$((max_width - 3))}"
  fi
}

# Fit the first group while preserving the model and the end of the path.
fit_first_group() {
  local max_width="$1"
  local fitted_model="$model"
  local fitted_dir="$dir_display"

  if [ -n "$fitted_model" ] && [ -n "$fitted_dir" ]; then
    local dir_width=$((max_width - ${#fitted_model} - 1))
    if [ "$dir_width" -ge 4 ]; then
      fitted_dir=$(truncate_left "$fitted_dir" "$dir_width")
    elif [ "${#fitted_model}" -gt "$max_width" ]; then
      fitted_model=$(truncate_right "$fitted_model" "$max_width")
      fitted_dir=""
    else
      fitted_dir=""
    fi
  elif [ "${#fitted_model}" -gt "$max_width" ]; then
    fitted_model=$(truncate_right "$fitted_model" "$max_width")
  elif [ "${#fitted_dir}" -gt "$max_width" ]; then
    fitted_dir=$(truncate_left "$fitted_dir" "$max_width")
  fi

  first_visible="$fitted_model"
  first_colored=""
  if [ -n "$fitted_model" ]; then
    first_colored="${CYAN}${fitted_model}${RESET}"
  fi
  if [ -n "$fitted_dir" ]; then
    if [ -n "$first_visible" ]; then
      first_visible="$first_visible $fitted_dir"
      first_colored="$first_colored ${DIM}${fitted_dir}${RESET}"
    else
      first_visible="$fitted_dir"
      first_colored="${DIM}${fitted_dir}${RESET}"
    fi
  fi
}

fit_group() {
  local value="$1"
  local color="$2"
  local max_width="$3"

  fitted_visible=$(truncate_right "$value" "$max_width")
  fitted_colored="${color}${fitted_visible}${RESET}"
}

append_group() {
  if [ -n "$current_visible" ]; then
    current_visible="$current_visible$GROUP_SEPARATOR$fitted_visible"
    current_colored="$current_colored$GROUP_SEPARATOR$fitted_colored"
  else
    current_visible="$fitted_visible"
    current_colored="$fitted_colored"
  fi
}

add_current_row() {
  rows+=("$current_colored")
  current_visible=""
  current_colored=""
}

width=$(terminal_width)
GROUP_SEPARATOR="  "
# Keep enough room for the model, an ellipsis, and a useful path suffix before
# choosing a single-row layout.
MIN_FIRST_GROUP_WIDTH=16

first_raw="$model"
if [ -n "$dir_display" ]; then
  if [ -n "$first_raw" ]; then
    first_raw="$first_raw $dir_display"
  else
    first_raw="$dir_display"
  fi
fi

details_visible=""
details_colored=""
if [ -n "$ctx_str" ]; then
  details_visible="ctx:${ctx_str}"
  details_colored="${YELLOW}ctx:${ctx_str}${RESET}"
fi
if [ -n "$rate_str" ]; then
  if [ -n "$details_visible" ]; then
    details_visible="$details_visible | $rate_str"
    details_colored="$details_colored ${DIM}|${RESET} ${MAGENTA}${rate_str}${RESET}"
  else
    details_visible="$rate_str"
    details_colored="${MAGENTA}${rate_str}${RESET}"
  fi
fi

has_git=0
has_details=0
[ -n "$git_info" ] && has_git=1
[ -n "$details_visible" ] && has_details=1

other_length=0
other_groups=0
if [ "$has_git" -eq 1 ]; then
  other_length=$((other_length + ${#git_info}))
  other_groups=$((other_groups + 1))
fi
if [ "$has_details" -eq 1 ]; then
  other_length=$((other_length + ${#details_visible}))
  other_groups=$((other_groups + 1))
fi

separator_length=${#GROUP_SEPARATOR}
all_length=$(( ${#first_raw} + other_length + other_groups * separator_length ))
rows=()
current_visible=""
current_colored=""

if [ "$all_length" -le "$width" ]; then
  # The whole statusline fits as-is.
  fit_first_group "$width"
  current_visible="$first_visible"
  current_colored="$first_colored"
  if [ "$has_git" -eq 1 ]; then
    fitted_visible="$git_info"
    fitted_colored="${GREEN}${git_info}${RESET}"
    append_group
  fi
  if [ "$has_details" -eq 1 ]; then
    fitted_visible="$details_visible"
    fitted_colored="$details_colored"
    append_group
  fi
  add_current_row
else
  # Prefer one row with a shortened path when the optional groups leave room.
  one_row_first_width=$((width - other_length - other_groups * separator_length))
  if [ "$one_row_first_width" -ge "$MIN_FIRST_GROUP_WIDTH" ]; then
    fit_first_group "$one_row_first_width"
    current_visible="$first_visible"
    current_colored="$first_colored"
    if [ "$has_git" -eq 1 ]; then
      fitted_visible="$git_info"
      fitted_colored="${GREEN}${git_info}${RESET}"
      append_group
    fi
    if [ "$has_details" -eq 1 ]; then
      fitted_visible="$details_visible"
      fitted_colored="$details_colored"
      append_group
    fi
    add_current_row
  else
    # On medium widths, keep the repo beside the model when possible and put
    # the less frequently needed context/rate details on the next row.
    fit_first_group "$width"
    first_row_colored="$first_colored"
    first_row_visible="$first_visible"

    if [ "$has_git" -eq 1 ]; then
      first_git_width=$((width - separator_length - ${#git_info}))
      if [ "$first_git_width" -ge "$MIN_FIRST_GROUP_WIDTH" ]; then
        fit_first_group "$first_git_width"
        current_visible="$first_visible"
        current_colored="$first_colored"
        fitted_visible="$git_info"
        fitted_colored="${GREEN}${git_info}${RESET}"
        append_group
        add_current_row

        if [ "$has_details" -eq 1 ]; then
          if [ "${#details_visible}" -le "$width" ]; then
            current_visible="$details_visible"
            current_colored="$details_colored"
          else
            fit_group "$details_visible" "$MAGENTA" "$width"
            current_visible="$fitted_visible"
            current_colored="$fitted_colored"
          fi
          add_current_row
        fi
      else
        current_visible="$first_row_visible"
        current_colored="$first_row_colored"
        add_current_row

        if [ "$has_details" -eq 1 ] && [ $(( ${#git_info} + separator_length + ${#details_visible} )) -le "$width" ]; then
          current_visible="$git_info"
          current_colored="${GREEN}${git_info}${RESET}"
          fitted_visible="$details_visible"
          fitted_colored="$details_colored"
          append_group
          add_current_row
        else
          fit_group "$git_info" "$GREEN" "$width"
          current_visible="$fitted_visible"
          current_colored="$fitted_colored"
          add_current_row
          if [ "$has_details" -eq 1 ]; then
            fit_group "$details_visible" "$MAGENTA" "$width"
            current_visible="$fitted_visible"
            current_colored="$fitted_colored"
            add_current_row
          fi
        fi
      fi
    elif [ "$has_details" -eq 1 ]; then
      first_details_width=$((width - separator_length - ${#details_visible}))
      if [ "$first_details_width" -ge "$MIN_FIRST_GROUP_WIDTH" ]; then
        fit_first_group "$first_details_width"
        current_visible="$first_visible"
        current_colored="$first_colored"
        fitted_visible="$details_visible"
        fitted_colored="$details_colored"
        append_group
        add_current_row
      else
        current_visible="$first_row_visible"
        current_colored="$first_row_colored"
        add_current_row
        if [ "${#details_visible}" -le "$width" ]; then
          current_visible="$details_visible"
          current_colored="$details_colored"
        else
          fit_group "$details_visible" "$MAGENTA" "$width"
          current_visible="$fitted_visible"
          current_colored="$fitted_colored"
        fi
        add_current_row
      fi
    else
      current_visible="$first_row_visible"
      current_colored="$first_row_colored"
      add_current_row
    fi
  fi
fi

printf '%b\n' "${rows[@]}"
