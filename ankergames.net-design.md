---
version: alpha
name: AnkerGames Dark Arcade
description: A high-contrast dark gaming marketplace system with vivid cyan accents and spacious editorial hierarchy.
colors:
  primary: "#2AA9E0"
  primary-strong: "#1E8EC2"
  secondary: "#475569"
  tertiary: "#F1F5F9"
  neutral: "#020617"
  surface: "#0B1220"
  surface-raised: "#111827"
  on-surface: "#FFFFFF"
  on-surface-muted: "#94A3B8"
  border: "#374151"
  success: "#22C55E"
  warning: "#F59E0B"
  error: "#EF4444"
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Inter
    fontSize: 27px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0px
  headline-md:
    fontFamily: Inter
    fontSize: 23px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.15px
  headline-sm:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: 600
    lineHeight: 23px
    letterSpacing: 0px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: 0px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0px
  nav-link:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  eyebrow:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 6px
  sm: 14px
  md: 24px
  lg: 48px
  xl: 168px
  gutter: 24px
  section: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 44px
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 16px
  card-raised:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 6px 12px
---

# AnkerGames Dark Arcade

## Overview

AnkerGames feels like a dark, game-first entertainment platform built for browsing, discovery, and quick action. The tone is energetic and cinematic, with a strong neon accent that cuts through a deep navy-black environment. Overall the interface is spacious rather than dense, using large hero imagery, clear hierarchy, and prominent calls to action to keep the experience immersive.

## Colors

- **Primary (#2AA9E0):** A bright cyan-blue used for the main action color, including primary buttons, progress indicators, and selected states. It gives the brand a modern arcade feel and stays highly visible on the dark background.
- **Primary-strong (#1E8EC2):** A deeper cyan for hover and active states when a stronger press contrast is needed without leaving the core brand hue.
- **Secondary (#475569):** A muted slate used for secondary borders and understated controls. It supports the UI without competing with the primary accent.
- **Tertiary (#F1F5F9):** A pale cool white used for secondary button text and light foreground details. It reads cleanly against the dark canvas.
- **Neutral (#020617):** The foundational background color, a near-black navy that creates the site’s dramatic stage-like presentation.
- **Surface (#0B1220):** A dark elevated surface for panels, cards, and inputs when separation from the background is needed.
- **Surface-raised (#111827):** A slightly lighter dark layer for chips, small pills, and subtle container contrast.
- **On-surface (#FFFFFF):** The primary text and icon color on dark surfaces. It ensures maximum readability across hero and navigation content.
- **On-surface-muted (#94A3B8):** A softened gray-blue used for less important metadata, supporting text, and subtle navigation labels.
- **Border (#374151):** A restrained dark border color for cards, input outlines, and fine separators.
- **Success (#22C55E):** A vivid green used for positive status chips and support-oriented promotional blocks.
- **Warning (#F59E0B):** A warm amber for cautionary emphasis when needed.
- **Error (#EF4444):** A clear red for destructive or failed states.

## Typography

Inter is the core UI typeface across headings, body copy, navigation, and controls. The system uses bold, compact headlines for strong hierarchy, while body text stays calm and readable at 16px with generous 26px leading in longer descriptions. Labels and buttons lean semibold for clarity, and nav links remain lighter to preserve an approachable browsing tone.

Use `headline-display`, `headline-lg`, `headline-md`, and `headline-sm` for content hierarchy from hero titles down to section headers. `body-lg`, `body-md`, and `body-sm` support descriptive copy, metadata, and fine print. `label-md` is the default control style for buttons and compact UI, while `eyebrow` can be used for small uppercase or near-uppercase tags where a tighter, more editorial feel is needed. Letter spacing is mostly neutral, with only subtle tightening in smaller display headings and slight tracking in label-style microcopy when necessary.

## Layout

The layout is built around a wide, immersive desktop canvas with a strong central content column and large edge breathing room. The hero section spans broadly across the viewport and relies on layered imagery and gradients rather than a rigid card grid. Spacing follows a comfortable rhythm: `xs` for micro gaps, `sm` for inline grouping, `md` for typical component spacing, `lg` for section separation, and `xl` for large page-scale voids.

Cards, pills, and buttons use compact padding to keep the experience efficient, but larger modules still feel roomy because of the surrounding negative space. Section blocks should favor clear vertical stacking, with a strong content gutter and consistent alignment rather than dense multi-column packing. This system works best with a fixed or semi-fixed maximum width centered on the page.

## Elevation & Depth

Elevation is mostly achieved through tonal layering and contrast rather than heavy shadow. The site uses deep background values, slightly raised surfaces, and subtle borders to separate content. Shadows are minimal; when used, they should stay soft and restrained so the interface preserves its crisp, game-launcher feel.

The main depth cue is the cinematic hero treatment: bright art against dark surrounds, with gradients and fades pulling attention toward the primary content. Cards and controls should feel integrated into the surface, not floating dramatically above it. Borders and subtle inner highlights are preferred over large blur shadows.

## Shapes

The corner-radius language is consistent and friendly, with `rounded.md` at 8px acting as the default. This gives the interface a modern, polished softness without drifting into a playful bubble style. Larger elements can use `rounded.lg` or `rounded.xl` sparingly, while badges, chips, and buttons should generally remain in the 8px family.

The overall shape feel is controlled and practical rather than decorative. Rectangular forms dominate, with enough rounding to feel contemporary and clickable. Circular controls should be reserved for compact icon-only actions and small utility buttons.

## Components

Buttons are highly visible and action-oriented. `button-primary` is the main CTA style: cyan fill, white text, 12px 24px padding, 44px height, and semibold label text. Use it for high-priority actions like download, sign up, or launch. `button-primary-hover` should deepen the cyan for clear feedback. `button-secondary` is the outlined alternative with transparent fill, light text, and a subtle border for secondary actions like Sign in or Details. `button-tertiary` should be text-only and minimally framed for inline links or low-emphasis actions.

Cards should use the `card` or `card-raised` treatment depending on emphasis. Keep borders subtle and padding at 16px so game tiles, info blocks, and content panels remain compact but readable. Avoid heavy shadows; use contrast and borders to define structure. Media cards and game thumbnails should remain rectangular with restrained rounding.

Inputs should follow the `input` style: dark surface, subtle border, rounded 8px corners, and comfortable 12px 16px padding. Focus states should reinforce the `primary` color without overwhelming the interface. Placeholder and helper text should use muted foreground colors for clarity.

Chips and pills should use the `chip` style with small padding and a raised dark surface. Status badges can also adopt bright accent fills when they need to stand out, as seen in the prominent green version and platform tags. Navigation links should stay lightweight and readable, with compact spacing and no heavy decoration.

Icon buttons, carousel arrows, and small utilities should be circular or softly rounded, using subtle surface contrast and minimal chrome. Promotional social blocks can be more colorful, but they should still obey the system’s compact padding and clear label hierarchy. Game covers and media tiles should be treated as the primary visual content and never reduced below strong thumbnail clarity.

## Do's and Don'ts

- Do keep the interface dark, cinematic, and contrast-rich.
- Do use cyan as the main interactive accent and reserve it for important actions and active states.
- Do maintain generous spacing around hero content and section blocks.
- Do keep typography crisp and highly legible with Inter and semibold labels.
- Do use subtle borders and tonal surfaces to create depth instead of heavy shadows.
- Don't introduce bright background colors that fight the dark arcade atmosphere.
- Don't over-round cards or controls; avoid pill shapes unless the component is specifically a chip or badge.
- Don't overcrowd the layout with dense grids or cramped text blocks.