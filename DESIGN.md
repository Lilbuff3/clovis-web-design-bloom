---
name: Clovis Web Design — Sunlit Glazier Colorfield & Architectural Daylight System
description: Sunlit architectural glass, forged-steel mullion grid, and physical pigment colorfield system for Clovis Web Design
colors:
  paper: "#EAE6DF"
  stone: "#DFDBD2"
  alabaster: "#F6F4EF"
  ink: "#141311"
  ink-soft: "#4A4742"
  cobalt: "#002FA7"
  cobalt-deep: "#00227A"
  persimmon: "#C83E14"
  persimmon-deep: "#A32F0C"
  amber: "#B87D1E"
  emerald: "#0B6E3F"
  oxblood: "#4E151B"
  maps-credit: "#5E5E5E"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.045em"
    lineHeight: 0.96
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontWeight: 400
  maps-attribution:
    fontFamily: "Roboto, sans-serif"
    fontWeight: 400
---

# Design System — Sunlit Glazier Colorfield (`craft-making-glazier-colorfield-partition`)

## Overview
Clovis Web Design uses a **Sunlit Glazier Colorfield & Forged-Steel Architectural System**. Instead of defaulting to dark-mode SaaS clichés (`#000000` / `#151515` + neon green) or rustic agricultural tropes, the site lives in bright California architectural daylight: warm seeded plaster (`#EAE6DF`), hand-rolled stone (`#DFDBD2`), specular alabaster (`#F6F4EF`), matte forged-steel glazing mullions (`#141311`), and saturated physical glass notes (**Cathedral Cobalt `#002FA7`**, **Kiln Persimmon `#C83E14`**, **Venetian Amber `#B87D1E`**, and **Vitreous Emerald `#0B6E3F`**).

## Colors
- **Sunlit Seeded Plaster (`#EAE6DF`) & Hand-Rolled Stone (`#DFDBD2`)**: Primary and secondary daylight grounds (`80%+` of the viewport), eliminating sterile `#FFFFFF` hospital glare and dark-mode caves.
- **Specular Alabaster (`#F6F4EF`)**: Active specimen bays, interactive form fields, and live website preview frames.
- **Forged Steel Mullions & Ink (`#141311`, `#4A4742`)**: Structural grid dividers (`1.5px` and `2px` solid rules) and high-contrast typography guaranteeing WCAG AA/AAA legibility.
- **Cathedral Cobalt (`#002FA7`)**: Primary engineering authority accent (`8.9:1` AAA contrast with `#F6F4EF` text), used for primary CTA panes, 3D refractive glass lites, and active stage headers.
- **Kiln Persimmon (`#C83E14` / `#A32F0C`)**: High-energy conversion and interactive hover accent (`5.12:1` WCAG AA contrast with white text).
- **Vitreous Emerald (`#0B6E3F`) & Venetian Amber (`#B87D1E`)**: Physical optical glass pigments for live Clovis workbench status, 100/100 CWV bars, and 4-directory AI citation telemetry.

## Typography
All fonts are self-hosted `.woff2` assets (`Bricolage Grotesque`, `DM Mono`) with `font-size-adjust: from-font` for zero-CLS rendering and zero italics.
- **Architectural Display & Body (`Bricolage Grotesque`)**: Used for all headings (`font-weight: 600`, `letter-spacing: -0.045em`, `line-height: 0.96`) and body copy (`font-weight: 400`).
- **Technical Telemetry (`DM Mono`)**: Used for live Clovis status clocks, mullion bay coordinates, Core Web Vitals readouts, and structural tags (`11px` minimum size).

## Layout & 3D Flow
- **Forged-Steel Mullion Grid**: Content is partitioned into architectural bays by exposed `#141311` steel hairlines rather than floating cards inside cards.
- **Zero-FCP-Cost Sunlit 3D Glass Stack**: The hero right bay features an interactive, scroll-choreographed 3D glass partition stack (Web Engineering Lite, 4-Directory AI Sync Lite, and GA4 Attribution Lite) with damped spring physics and live colored floor caustics.
- **DOM-Preserving Spatial Compression (`5.81×` Viewports at `1440×900`)**: To balance elite studio minimalism (`Work & Co` at `3.66×`, `Bakken & Bæck` at `6.04×`) with the fact-density required by AI search crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Googlebot`), the homepage compresses 9 sections into **`5,233px` (`5.81× viewports`, down `43.0%` from `9,180px`)** while keeping 100% of the semantic HTML DOM pre-rendered on first byte:
  1. **Viewport-1 Proof Peek (`#top` → `#who`)**: `#top` is capped at `707px` (`0.79×` viewport) so the top `193px` (`21.4%`) of `#who` peeks into Viewport 1 without scrolling.
  2. **Unified 5-Lite Tablist & Green-Space Strip (`#who`, `962px`)**: The 3D isometric partition rack acts directly as `role="tablist"` with all 5 `<div role="tabpanel">` specification sheets pre-rendered in the static HTML DOM, paired with a 4-column Green-Space & Playbooks bento strip and native `<details>` specification drawer.
  3. **Horizontal 12-Col AI Audit Bar + Tabbed Case Study Switcher (`#check` `256px` + `#harvest` `682px`)**: `<LeadLeakAudit />` sits in a single horizontal 12-column bar above a tabbed specimen switcher (`Case 01: Kidney Specialist Inc.` ⇄ `Case 02: Big Bros Dumpster Rentals` ⇄ `Compare Both`), keeping both `<article>` blocks in the static DOM while fitting `#check` + `#harvest` into one `900px` desktop viewport.
  4. **Side-by-Side 12-Col Architectural Ledgers**: `<Season />` (`5 cols` 2×2 process grid) + `<Compare />` (`7 cols` semantic comparison table) share one `601px` row; `<Grower />` (`6 cols`) + `<FAQ />` (`6 cols`) share one `503px` row; and `<Stand />` (`#stand`, `787px`) places Step 01 Foundations (`7 cols`) alongside Step 02/03 Channel Toggles & Live Scope (`5 cols`).

