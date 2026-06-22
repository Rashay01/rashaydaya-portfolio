# Hero LCP Fix — CLI Stagger Reveal

**Date:** 2026-05-22  
**Status:** Approved

## Problem

PageSpeed reports `NO_LCP` (mobile + desktop) and a 3.3s desktop FCP. Root cause: the entire hero section — including the `<h1>` — is wrapped in a `motion.div` with `initial={{ opacity: 0 }}` that stays invisible for 1200ms. Lighthouse finds no valid LCP candidate (the Three.js canvas is not an LCP element). The desktop FCP delay is compounded by Cal Sans being discovered late via `@font-face` in CSS.

## Solution

### 1. `ZenithHero.tsx` — animation restructure

- **Render immediately (no animation gate):** `<h1>` heading, role `MonoLabel`, and top label. These are in the DOM at full opacity from SSR, giving Lighthouse a text LCP candidate.
- **Stagger in after `swept` (1200ms):** paragraph, CTA buttons, stats `<dl>`, geo text block, and monolith wrapper. Each uses `motion.div` with `initial={{ opacity: 0, y: 6 }}` → `animate={{ opacity: 1, y: 0 }}`, staggered 120ms apart.
- **Reduced motion:** `prefersReducedMotion` collapses all durations to 0, unchanged from current behaviour.
- **Sweep line:** unchanged.

### 2. `layout.tsx` — Cal Sans preload

Add `<link rel="preload" href="/fonts/CalSans-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />` in `<head>`. Eliminates the FOUT that delays desktop FCP.

## Files Changed

| File | Change |
|------|--------|
| `src/components/sections/ZenithHero.tsx` | Restructure animation — h1/labels always visible, stagger rest |
| `src/app/layout.tsx` | Add Cal Sans preload link |

## Success Criteria

- PageSpeed LCP registers a value (not `NO_LCP`)
- Desktop FCP improves from 3.3s
- Visual appearance unchanged — sweep line still plays, CLI stagger feels like terminal output
