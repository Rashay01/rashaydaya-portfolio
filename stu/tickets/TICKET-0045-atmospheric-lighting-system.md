# TICKET-0045 — Atmospheric page lighting system

**Epic:** EPIC-06-cinematic
**Estimate:** M
**Files:** `src/components/sections/ForgeProjects.tsx`,
           `src/components/sections/KajiLabs.tsx`,
           `src/components/sections/ExperienceTimeline.tsx`,
           `src/app/page.tsx` (hero-origin gradient wrapper)

## Goal

Every section on the homepage feels lit by the same green artifact light
source. Hard cuts to flat black are replaced by atmospheric gradient bridges.

## Acceptance criteria

- Hero-origin radial gradient: `rgba(74,222,128,0.05)`, 900px radius, extends
  ~200px below the hero fold into the next section
- Each major section (`#forge`, `#kaji-labs`, `#experience`) has a top-edge
  ambient glow: `radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04)
  0%, transparent 60%)`
- No section has its own colour identity — one light family, one source
- Section headings step up to editorial scale:
  `clamp(2rem, 4vw, 3.5rem)`, `leading-none`, `tracking-[-0.03em]`
- Kaji Labs category titles: `clamp(1.5rem, 3vw, 2.5rem)`

## Notes

- Gradients implemented as CSS, not JS — `::before` pseudo or wrapper div
- Do not change any section's content structure, only add gradient treatment
  and resize headings
