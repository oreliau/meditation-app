---
name: Aura
colors:
  surface: '#12121d'
  surface-dim: '#12121d'
  surface-bright: '#383845'
  surface-container-lowest: '#0d0d18'
  surface-container-low: '#1b1a26'
  surface-container: '#1f1e2a'
  surface-container-high: '#292935'
  surface-container-highest: '#343440'
  on-surface: '#e3e0f1'
  on-surface-variant: '#c8c5cf'
  inverse-surface: '#e3e0f1'
  inverse-on-surface: '#302f3b'
  outline: '#918f99'
  outline-variant: '#47464e'
  surface-tint: '#c2c2f2'
  primary: '#c2c2f2'
  on-primary: '#2b2d53'
  primary-container: '#1a1b41'
  on-primary-container: '#8283af'
  inverse-primary: '#5a5b84'
  secondary: '#cdbdff'
  on-secondary: '#352072'
  secondary-container: '#4c388a'
  on-secondary-container: '#bda8ff'
  tertiary: '#b8cac9'
  on-tertiary: '#233333'
  tertiary-container: '#122222'
  on-tertiary-container: '#798a8a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c2c2f2'
  on-primary-fixed: '#16173d'
  on-primary-fixed-variant: '#42436b'
  secondary-fixed: '#e8deff'
  secondary-fixed-dim: '#cdbdff'
  on-secondary-fixed: '#20015d'
  on-secondary-fixed-variant: '#4c388a'
  tertiary-fixed: '#d4e6e5'
  tertiary-fixed-dim: '#b8cac9'
  on-tertiary-fixed: '#0e1e1e'
  on-tertiary-fixed-variant: '#3a4a49'
  background: '#12121d'
  on-background: '#e3e0f1'
  surface-variant: '#343440'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 24px
  container-padding-desktop: 64px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style

This design system embodies "Zen Minimalism" fused with "Glassmorphism" to create an immersive, high-end sanctuary for mindfulness. The brand personality is serene, sophisticated, and ethereal. It targets a discerning audience seeking a digital escape that feels as premium as a physical wellness retreat.

The visual style relies on:
- **Depth through Translucency:** Using frosted glass effects to stack information without breaking the user's connection to calming background visuals.
- **Breathable Composition:** Extreme use of negative space to reduce cognitive load.
- **Soft Transitions:** Motion and layering that mimic the fluid nature of breath and light.

## Colors

The palette is anchored in a dark, immersive environment to minimize eye strain and promote relaxation.

- **Deep Indigo (#1A1B41):** The foundation. Used for deep backgrounds and primary surfaces to evoke the evening sky or deep water.
- **Soft Lavender (#BAA5FF):** The accent. Used for primary actions, active states, and focus elements. It provides a gentle, spiritual energy.
- **Mint Mist (#E0F2F1):** The highlight. Used for high-contrast text and subtle iconography to provide a sense of fresh air and clarity.
- **Surfaces:** Backgrounds should utilize a gradient of Deep Indigo to a darker Neutral (#0F0F1A) to create a sense of infinite space.

## Typography

The typographic hierarchy balances editorial elegance with functional clarity. 

- **Headlines:** Playfair Display is used for titles, session names, and quotes. It should be typeset with generous leading to feel "airy."
- **UI Elements:** Inter handles all functional data, navigation, and long-form descriptions. 
- **Hierarchy:** Use lowercase for headlines to feel more approachable, or wide-tracked uppercase Labels for a structured, premium look.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with wide margins to create a "sanctuary" feel where content is never crowded.

- **Desktop:** 12-column grid with 64px outer margins. Content is often centered in a max-width 1200px container to prevent eye fatigue.
- **Mobile:** 4-column grid with 24px margins. Elements use vertical stacking with generous padding (minimum 32px) between distinct sections.
- **Rhythm:** Spacing follows an 8px base unit. Use larger gaps (48px+) between functional groups to allow the eye to rest.

## Elevation & Depth

Depth is conveyed through "Glassmorphism" rather than traditional shadows.

- **Glass Layers:** Surfaces use a semi-transparent fill of Mint Mist or Lavender at 5-10% opacity. 
- **Backdrop Blur:** A heavy blur (20px to 40px) is applied to all container backgrounds to create a "frosted" effect over the base indigo gradient.
- **Edge Definition:** Instead of shadows, use a 1px inner border (stroke) with 20% opacity white/Mint Mist on the top and left edges to simulate light hitting the glass.
- **Z-Index:** Only two primary levels exist: the Background (Immersive) and the Glass Layer (Interactive).

## Shapes

Shapes are organic and soft, avoiding harsh 90-degree angles to maintain a calming aesthetic.

- **Containers:** Standard cards and modals use `rounded-lg` (1rem).
- **Interactive Elements:** Buttons and chips use `rounded-xl` (1.5rem) or full pill shapes to feel tactile and friendly.
- **Icons:** Use thin-stroke (1.5px) icons with rounded terminals to match the typography.

## Components

### Buttons
- **Primary:** Lavender (#BAA5FF) background with Indigo text. High roundedness.
- **Secondary (Glass):** Frosted glass background with Mint Mist border and text.
- **Play Button:** Large, circular glass element with a subtle "pulse" animation.

### Cards
- Always utilize the Glassmorphism style. 
- Content within cards should have at least 24px of internal padding.
- Imagery inside cards should have subtle rounded corners (8px) to sit nested within the larger container.

### Inputs & Selectors
- **Fields:** Underlined style or ghost-input style (no background, only a bottom border) to remain minimal.
- **Selection:** Use Lavender glows for active states rather than heavy fills.

### Navigation
- **Bottom Bar (Mobile):** A floating glass dock with high backdrop blur, detached from the bottom edge of the screen.

### Meditation Specifics
- **Progress Ring:** A thin, Mint Mist circular stroke that fills slowly as the session progresses.
- **Audio Visualizer:** Gentle, low-opacity sine waves that move rhythmically with the audio.