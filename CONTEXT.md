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
A session that is underway — Running or Paused — as opposed to one that hasn't started (Idle) or has already ended (Stopped, Completed). Only an active session can be stopped. A standalone Session’s total duration can change while Paused, preserving elapsed time; the new duration must exceed elapsed time.
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

**Reminder**:
Either of the two opt-in, repeating local (on-device, never push) daily notifications — the Morning presence reminder and the Evening summary — scheduled at device-local time and re-issued with fresh content on every app foreground.
_Avoid_: Push notification, alarm, Session-end alert (see below — event-triggered per session, not daily/repeating)

**Session-end alert**:
An opt-in, local (on-device, never push) one-shot notification armed the moment a Session starts Running, for whenever that Session reaches Completed while the app isn't in the foreground. Scheduled against the Session's absolute end time so it survives backgrounding, the lock screen, and a full app quit; cancelled if the Session is Paused, Stopped, or completes while the app is foregrounded (the existing completion haptic/chime already covers that case).
_Avoid_: Reminder (that term is reserved for the two daily notifications above), Session alarm(s)/alarm (the mockups' "Alarmes de Session" depict a different, unbuilt concept: a user-managed list of named, recurring, day-of-week alarms — not this single automatic toggle)

**Presence sentence**:
One of the bundled, curated "being present" lines the Morning presence reminder carries. Chosen per delivery day so consecutive mornings never repeat.
_Avoid_: Quote, tip

### Explorer Programs

**Program**:
An ordered, bundled course of meditation Sessions. A Program has stable identity and independent progress; completing a Program session requires natural timer completion.

**Program session**:
One fixed-duration Session within a Program. A Program session is prepared through the shared timer and is marked complete only when that timer reaches zero naturally.

**Program progress**:
The locally persisted set of completed Program session identifiers for each Program. Progress survives relaunch and does not include standalone Sessions.

**Today’s practice**:
The Explorer presentation of the current device-local Daily stats. It is an aggregate of completed Sessions, not a per-session history.

**Advice**:
A bundled, read-only mindfulness guidance card shown in Explorer. Advice is not generated remotely and does not start a Session.

### Onboarding

**Onboarding**:
The one-time, four-step introduction (Welcome, Intentions, Daily Rhythm, Soundscape) shown before the tab navigator on a device's first launch, gated by the locally persisted `hasCompletedOnboarding` flag. Never shown again once completed, on that device.
_Avoid_: Setup wizard, sign-up flow (there is no account system — Onboarding never asks for or creates one)

**Intention**:
One of a fixed set of goals (easing stress, sleep, focus, or a daily presence practice) a person selects during Onboarding to describe why they're here. Multiple Intentions can be selected; they are persisted for future personalization but do not yet change any in-app behavior.
_Avoid_: Goal (reserve "Intention" for this Onboarding concept specifically)

**Experience level**:
A person's self-reported familiarity with meditation (Beginner, Regular, or Zen guide), chosen once during Onboarding's Intentions step. Persisted for future personalization; nothing currently reads it.

**Soundscape preference**:
A person's chosen ambient audio identity (e.g. Amber Dawn, Silent River, Misty Forest), selected during Onboarding's final step. Persisted for when real audio playback is built; the Onboarding screen itself does not play audio.
_Avoid_: Soundscape (reserve that for the eventual playable feature; "preference" makes clear this is only a stored choice today)
