# TICKET-0044 — Hero cinematic overhaul

**Epic:** EPIC-06-cinematic
**Estimate:** L
**File:** `src/components/sections/ZenithHero.tsx`

## Goal

Transform the hero from a clean dark layout into a cinematic opening. The
green artifact becomes the page's gravitational centre and light source. The
name enters like a film title.

## Acceptance criteria

- Artifact scales to ~55% viewport height on desktop, centred vertically in
  left column (not bottom-left)
- Radial gradient behind artifact: `#4ade80`, 4–6% opacity, ~900px radius,
  bleeds ~200px below hero fold
- Name entrance: "Rashay" blur-resolves (opacity 0→1, blur 8px→0) over 0.8s,
  "Daya" 0.2s behind, subtitle 0.4s after Daya, CTAs 0.2s after subtitle
- No bounce, no Y translation on name — pure dissolve/resolve
- Artifact breathing: scale 1→1.015 synced with glow opacity 4%→6%, 4s loop
- Bottom hero void eliminated — artifact and glow anchor the full column
- `prefers-reduced-motion`: no breathing, no entrance animation (immediate)

## Notes

- Entrance animation replaces current Framer Motion `initial/animate` on hero
  elements — audit existing animation props before rewriting
- The glow gradient is a CSS div, not a canvas or SVG
- Breathing uses CSS animation or Framer Motion `animate` with `repeat:
  Infinity` — CSS preferred for performance
