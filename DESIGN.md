---
name: Clovis Web Design System
description: High-converting, warm-editorial design system for Clovis Web Design
colors:
  paper: "#f7f0e3"
  cream: "#fcf8f0"
  ink: "#1e2b23"
  ink-soft: "#4a5a4f"
  persimmon: "#ee5a2f"
  persimmon-deep: "#c9431d"
  citrus: "#ffb43b"
  leaf: "#2e6a4c"
  sage: "#dbe5cf"
  sky: "#cfe2ee"
  blush: "#f7d3bf"
  paper-deep: "#e9e2d4"
typography:
  display:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontWeight: 600
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  arch: "28px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.persimmon}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.persimmon-deep}"
---

# Design System

## Overview
Clovis Web Design couples tactile, warm-editorial warmth with rigorous conversion engineering. Grounded in California Central Valley sun and soil tones, the visual language departs entirely from generic cool-gray SaaS templates, utilizing high-contrast warm paper foundations (`#f7f0e3`), deep ink typography (`#1e2b23`), and energetic persimmon accents (`#ee5a2f`).

## Colors
- **Paper & Cream (`#f7f0e3`, `#fcf8f0`)**: The warm tactile canvas; prevents sterile digital white glare in outdoor mobile use.
- **Ink & Ink-Soft (`#1e2b23`, `#4a5a4f`)**: Deep botanical dark tones providing WCAG AAA text contrast without dead pure black (`#000000`).
- **Persimmon & Persimmon-Deep (`#ee5a2f`, `#c9431d`)**: Primary conversion accent for high-intent CTAs, phone numbers, and badges.
- **Citrus & Leaf (`#ffb43b`, `#2e6a4c`)**: Secondary natural accents for trust ratings, badges, and operational status.
- **Sage, Sky, Blush (`#dbe5cf`, `#cfe2ee`, `#f7d3bf`)**: Muted card tint washes.

## Typography
- **Display**: `Fraunces` — Expressive, warm serif with soft terminals used for major value statements and hero headers.
- **Sans/Body**: `Bricolage Grotesque` — Highly legible, characterful grotesque sans for body copy, proof metrics, and navigation.
- **Mono**: `DM Mono` — Precise technical mono used for SLAs, pricing tags, speed metrics, and timestamps.

## Layout
- **Mobile-First Rhythm**: Built for thumb-driven conversion with persistent tap-to-call bars and quick text action triggers.
- **Density**: Open, breathable vertical spacing (48px–96px section padding) with clean typographic breaks rather than heavy container borders.

## Elevation & Depth
- **Warm Tonal Layering**: Avoids heavy artificial drop shadows. Uses background tonal shifts (`cream` on `paper`), subtle borders with low-opacity ink, and soft warm ambient halos.

## Shapes
- **Friendly Geometry**: Generous rounded corners (`12px` to `20px` for cards, pill `9999px` for action buttons) paired with sharp editorial typography.

## Components
- **Primary CTA**: High-contrast persimmon pill button with prominent tap target and micro-interaction states.
- **Metric Badges**: Monospace tag pills displaying Core Web Vitals (e.g. `0.9s LCP`, `100/100`) and turnaround metrics.
- **Proof Cards**: Clean background shifts (`bg-cream`) with subtle border tints.

## Do's and Don'ts
- **DO** use rich, warm paper and ink tints with high contrast.
- **DO** keep touch targets at or above 48x48px on mobile.
- **DO** emphasize direct client ownership, speed, and real phone calls.
- **DON'T** use purple-to-blue SaaS gradients or default cool grays.
- **DON'T** use farm/orchard novelty metaphors ("seedling", "harvest", "picked fresh").
- **DON'T** use thick colored borders on one side of a card (`border-l-4`).
- **DON'T** use elastic or bouncy easing curves; use smooth exponential deceleration.
