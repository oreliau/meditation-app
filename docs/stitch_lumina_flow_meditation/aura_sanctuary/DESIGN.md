---
name: 'Aura: Sanctuary'
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#55433d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#88726c'
  outline-variant: '#dbc1b9'
  surface-tint: '#99462a'
  primary: '#99462a'
  on-primary: '#ffffff'
  primary-container: '#d97757'
  on-primary-container: '#541400'
  inverse-primary: '#ffb59e'
  secondary: '#85530d'
  on-secondary: '#ffffff'
  secondary-container: '#fdb96c'
  on-secondary-container: '#774800'
  tertiary: '#695d4a'
  on-tertiary: '#ffffff'
  tertiary-container: '#9f907b'
  on-tertiary-container: '#332a1a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#7a2f15'
  secondary-fixed: '#ffddbb'
  secondary-fixed-dim: '#fdb96c'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#673d00'
  tertiary-fixed: '#f2e0c8'
  tertiary-fixed-dim: '#d5c4ad'
  on-tertiary-fixed: '#231a0c'
  on-tertiary-fixed-variant: '#504534'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
  terracotta: '#D97757'
  soft-amber: '#E9A85D'
  cream-surface: '#FFFDF9'
  earth-container: '#F5F0E6'
  earth-on-surface: '#433D35'
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

This design system reimagines the original "Zen Minimalism" as a **Warm Minimalist Sanctuary**. The brand personality is peaceful, nurturing, and organic, shifting from an evening-inspired palette to one that feels sun-drenched and grounded. It targets users seeking a digital space that feels like a quiet, sunlit room at dawn.

The visual style is characterized by:
- **Warm Minimalism:** A focus on essentialism using organic tones rather than cold whites or grays.
- **Organic Softness:** Heavy use of whitespace to create a "breathable" interface that reduces cognitive friction.
- **Tactile Serenity:** Subtle depth created through tonal layering and soft edges, mimicking the way light hits natural surfaces like plaster, ceramic, or linen.

## Colors

The palette is anchored in earthy, sun-drenched tones to create a sense of warmth and natural light.

- **Primary (Terracotta - #D97757):** Used for primary calls to action and key brand moments. It provides a grounded, organic energy.
- **Secondary (Soft Amber - #E9A85D):** Used for accents, highlights, and secondary interactive states, evoking morning sunlight.
- **Tertiary (Dusty Clay - #8C7E6A):** A muted, earthy neutral used for secondary text or subtle decorative elements.
- **Neutral (Warm White - #FFFDF9):** The "Sanctuary" foundation. This color is used for the primary background to reduce harsh glare and provide a soft, paper-like feel.
- **Surface Containers:** Utilize **#F5F0E6** (Earth Container) for cards and grouped content to provide a soft distinction from the primary background.

## Typography

The typography balances the traditional elegance of Playfair Display with the functional modernism of Inter. Contrast has been carefully calibrated for readability on the warm cream backgrounds.

- **Headlines:** Playfair Display is used for evocative titles and display text. Use the terracotta accent sparingly in headlines to draw attention to emotional keywords.
- **Body & Functional UI:** Inter handles all long-form reading and functional labels. Use a dark earthy charcoal (#433D35) rather than pure black for text to maintain the soft aesthetic.
- **Readability:** Ensure a minimum of 4.5:1 contrast ratio for body text against the cream surfaces. For Playfair Display, slightly tighter letter spacing is used in large sizes to maintain a sophisticated, "editorial" look.

## Layout & Spacing

This design system uses a **Fluid Grid** with intentional "quiet zones" to maintain a sanctuary feel.

- **Desktop:** A 12-column grid with a maximum content width of 1200px. Large 64px outer margins ensure the content feels like it's floating in light.
- **Mobile:** A 4-column grid with 24px margins. Section gaps are generous (48px) to prevent the UI from feeling cluttered on small screens.
- **Rhythm:** An 8px linear scale governs all padding and margins. In this warm minimalist style, err on the side of *more* space rather than less to emphasize the "Sanctuary" theme.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layering** and **Ambient Shadows** that mimic soft, natural light casting on matte surfaces.

- **Surface Tiers:** Use subtle variations of cream and beige to stack elements. The background is the lightest layer, while containers and cards use slightly darker or more saturated earthy tones to appear "inset" or "resting."
- **Soft Shadows:** Shadows should be extremely diffused (30px-60px blur) with very low opacity (5-8%) and a warm tint (e.g., a shadow with a hint of burnt umber) to avoid looking "dirty."
- **Low-Contrast Outlines:** For certain elements like input fields, use a 1px border in a slightly darker earth tone (#E0DACC) instead of shadows for a cleaner, flatter look.

## Shapes

The shape language is organic and soft. Sharper edges are avoided to maintain the peaceful aesthetic.

- **Primary Elements:** Cards and containers use `rounded-lg` (1rem).
- **Interactive Elements:** Buttons, chips, and notification toasts use `rounded-xl` (1.5rem) or full pill shapes to feel approachable and comfortable to touch.
- **Iconography:** Use icons with rounded caps and corners. Stroke weight should be light (1.5px) to complement the airy typography.

## Components

### Buttons
- **Primary:** Terracotta background with Warm White text. Pill-shaped for a friendly, tactile feel.
- **Secondary:** Transparent background with a Terracotta border and text. 
- **Ghost:** No background or border; uses Soft Amber text with an underline on hover.

### Cards & Containers
- Cards use the `earth-container` (#F5F0E6) background. 
- Internal padding is a minimum of 24px.
- Images within cards should have a 12px corner radius to harmonize with the container's 16px radius.

### Input Fields
- Fields are "ghost-style" with a soft bottom-border or a very light tonal fill (#F0EAE0).
- Focused states use a Soft Amber glow and a 2px bottom border.

### Chips & Tags
- Used for categories or mood selectors. 
- Use a light tint of the Primary color (Terracotta at 10% opacity) for the background with full-opacity Terracotta text.

### Navigation
- **Top Navigation:** Transparent background that becomes the Warm White surface with a very subtle bottom shadow upon scroll.
- **Mobile Navigation:** A floating dock using a tonal background (#F5F0E6) rather than glassmorphism, keeping the look grounded and organic.