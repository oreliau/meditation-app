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
