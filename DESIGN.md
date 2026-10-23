---
name: Clovis Web Design System
description: High-contrast architectural design system for Clovis Web Design (modeled on Branded Agency)
colors:
  obsidian: "#151515"
  obsidian-surface: "#1e1e1e"
  paper: "#ffffff"
  stone: "#ededed"
  cream: "#ededed"
  ink: "#151515"
  ink-soft: "#525252"
  persimmon: "#ff4d1c"
  persimmon-deep: "#e03e10"
  signal: "#ff4d1c"
  emerald: "#00ff08"
  leaf: "#00a843"
  citrus: "#ff4d1c"
  sage: "#ededed"
  sky: "#ededed"
  blush: "#ededed"
  maps-credit: "#5e5e5e"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 500
    letterSpacing: "-0.045em"
    lineHeight: 0.98
  wordmark:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontWeight: 400
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontWeight: 400
  maps-attribution:
    fontFamily: "Roboto, sans-serif"
    fontWeight: 400
rounded:
  button: "8px"
  nav: "12px"
  card: "16px"
  full: "9999px"
components:
  button-primary-dark:
    backgroundColor: "#ffffff"
    textColor: "#070707"
    rounded: "8px"
    padding: "16px 24px"
  button-primary-light:
    backgroundColor: "#151515"
    textColor: "#ffffff"
    rounded: "8px"
    padding: "16px 24px"
  button-ghost-dark:
    border: "1px solid rgba(255, 255, 255, 0.8)"
    textColor: "#ffffff"
    rounded: "8px"
  button-ghost-light:
    border: "1px solid rgba(21, 21, 21, 0.25)"
    textColor: "#151515"
    rounded: "8px"
---

# Design System

## Overview
Clovis Web Design uses a **High-Contrast Architectural Design System** inspired by Branded Agency (`brandedagency.com`). It replaces warm rustic paper/orchard tropes with crisp architectural contrast: deep obsidian dark sections (`#151515`), elevated carbon cards (`#1E1E1E`), pure editorial white canvases (`#FFFFFF`), soft architectural stone surfaces (`#EDEDED`), and tightly tracked geometric display typography.

## Colors
- **Deep Obsidian (`#151515`) & Elevated Obsidian Surface (`#1E1E1E`)**: Primary dark canvas and dark structural card surfaces (`rounded-[16px]`) with `1px solid rgba(255, 255, 255, 0.10)` hairline borders.
- **Crisp Editorial White (`#FFFFFF`) & Soft Architectural Stone (`#EDEDED`)**: Primary light canvas (`--color-paper`) and subtle architectural stone cards (`--color-cream` / `--color-stone`, `rounded-[16px]`).
- **Ink & Ink-Soft (`#151515`, `#525252`)**: Primary and secondary typography on light surfaces, guaranteeing WCAG AA/AAA legibility without low-opacity washed-out text.
- **Signal Persimmon (`#FF4D1C` / deep `#E03E10`)**: High-energy conversion and interactive hover accent, used sparingly for active states, orbital rings, and key metric highlights.
- **Signal Emerald (`#00FF08` on dark / `#00A843` on light)**: Live status indicator dot, FCP speed bar, and verified citation telemetry.

## Typography
All fonts are self-hosted `.woff2` variable/static assets (`Bricolage Grotesque`, `Fraunces`, `DM Mono`) with `font-size-adjust: from-font` for zero-CLS rendering.
- **Geometric Display & Body (`Bricolage Grotesque`)**: Styled after Branded Agency's `Satoshi` for all primary `H1`, `H2`, and `H3` headings — tightly tracked (`letter-spacing: -0.045em`), compact (`line-height: 0.98`), and medium weight (`font-weight: 500`), paired with clean `400` weight body copy.
- **Editorial Wordmark & Pull-Quotes (`Fraunces`)**: Reserved strictly for the centered editorial wordmark in the top navigation bar (`Clovis Web Design`) and subtle editorial pull-quotes.
- **Technical Telemetry (`DM Mono`)**: Used for live Clovis status clocks, Core Web Vitals badges, coordinates, and uppercase pill tags (`11px` minimum size).

## Layout & Rhythm
- **Alternating High-Contrast Rhythm**: Sections alternate cleanly between Deep Obsidian (`#151515`), Crisp Editorial White (`#FFFFFF`), and Soft Architectural Stone (`#EDEDED`).
- **Split-Screen Hero + 3-Column Vertical Marquee**: The hero pairs a left-aligned value proposition and `8px` CTA bar with a 3-column infinite vertical marquee of 12 real engineering and client outcome proof cards.
- **Persistent Navigation**: A 3-column top dark-glass header (`rounded-[12px]`) paired with a floating bottom dark-glass pill dock on desktop (`md:flex`) and a thumb-friendly obsidian action bar on mobile (`md:hidden`).

## Shapes & Components
- **Surface Cards (`rounded-[16px]`)**: Clean `16px` border radius across all bento tiles, vertical marquee proof cards, case study containers, and interactive drawers.
- **Buttons (`rounded-[8px]`)**: Crisp `8px` border radius.
  - On dark sections: Solid white (`#FFFFFF` background, `#070707` text, hovering to `#FF4D1C` with `#FFFFFF` text) paired with `1px` ghost buttons (`border-white/80 text-white`).
  - On light sections: Solid obsidian (`#151515` background, `#FFFFFF` text, hovering to `#E03E10`) paired with `1px` ghost outlines (`border-ink/25 text-ink`).
- **Icons**: Drawn SVG strokes (`src/components/Icon.astro`), never emoji.

## Do's and Don'ts
- **DO** alternate cleanly between `#151515` obsidian and `#FFFFFF` / `#EDEDED` light architectural surfaces.
- **DO** use `rounded-[16px]` for cards and `rounded-[8px]` for buttons.
- **DO** keep touch targets at or above `48x48px` on mobile.
- **DO** maintain `11px` (`text-[11px]`) as the strict minimum font size for mono tags and labels.
- **DON'T** use warm paper grain overlays, citrus/farm/orchard illustrations, or rustic metaphors.
- **DON'T** combine `bg-persimmon` with `text-cream` or `text-white` on the same element (use `bg-persimmon-deep` or solid white/obsidian buttons for WCAG contrast).
- **DON'T** use `text-ink/10` through `text-ink/69` (use `text-ink-soft` on light surfaces or `text-white/70`+ on dark surfaces).
- **DON'T** put numbered labels above section headings.
