# Lumina Flow (Meditation App)

A meditation app styled by the **Aura** design system (`DESIGN.md`): color, typography, spacing, and elevation tokens shared across Expo Router web and mobile.

## Language

**Aura**:
The name of this app's design system — the token set (colors, typography, spacing, elevation) defined in `DESIGN.md`. Not a theme name on its own.
_Avoid_: Using "Aura" alone to mean a specific theme; "design system" (use the proper name)

**Theme**:
One of the two token sets — `light` or `dark` — that supply color values to the app at runtime. DESIGN.md names them "Aura: Sanctuary" (light) and "Aura: Dark" (dark) for display purposes, but code always keys them by the conventional identifiers `light`/`dark`, never by their DESIGN.md display names.
_Avoid_: Palette (the raw color token set is part of a theme, not synonymous with it), Sanctuary/Aura Dark (display names only, never code identifiers)

**Adaptive mode**:
The default theme-selection behavior: the active theme follows the OS-level light/dark appearance setting.
_Avoid_: System theme, auto mode

**Manual override**:
A user-chosen theme selection that takes precedence over adaptive mode and persists across app restarts.
_Avoid_: Forced theme, pinned theme

### Session Timer

**Session**:
One timed run of the meditation timer, bounded by its start and its end (via Stop, Restart, or reaching zero on its own).
_Avoid_: Timer (the timer is the display/mechanism; the session is the run it measures)

**Idle**:
The session state before a session has started, or after choosing a duration but before pressing Play.

**Running**:
The session state where the remaining time is actively counting down.

**Paused**:
The session state where the remaining time is frozen and can be resumed from where it left off.

**Active**:
A session that is underway — Running or Paused — as opposed to one that hasn't started (Idle) or has already ended (Stopped, Completed). Only an active session can be stopped, and the duration can't be changed while one is active.
_Avoid_: In progress, live

**Stopped**:
The session state after ending early, before the remaining time reached zero on its own. Distinct from Completed: no completion feedback plays.
_Avoid_: Cancelled

**Completed**:
The session state after the remaining time reached zero on its own, without being stopped early.

**Restart**:
Ending the current session early and immediately beginning a new one at the full configured duration.
_Avoid_: Reset (Restart both ends and begins a session, not just zeroes a clock)

### Daily Reminders

**Daily stats**:
The aggregate count and total duration of Sessions Completed on a given device-local calendar day. An aggregate only — not a per-session history or log.
_Avoid_: History, log, session log (those imply a per-session record, which this deliberately is not)

**Morning presence reminder**:
The 8am local notification carrying a rotating, on-device-selected motivational sentence about presence. "On-device" here means no network call and no real AI/LLM inference — content comes from a bundled curated set, not generation.
_Avoid_: AI reminder, AI notification (no LLM is involved)

**Evening summary**:
The 6pm local notification reflecting that day's Daily stats in a reflective, personalized tone, or a generic gentle nudge on a day with no Daily stats.
_Avoid_: Daily summary (reserve "Daily stats" for the underlying data, "Evening summary" for the notification presenting it)
