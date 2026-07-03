# TICKET-0047 — Project section spotlight treatment

**Epic:** EPIC-06-cinematic
**Estimate:** M
**Files:** `src/components/sections/ForgeProjects.tsx`,
           `src/components/ui/ProjectCard.tsx`,
           `src/components/sections/KajiLabs.tsx`

## Goal

Project cards feel like staged product shots, not list items. The Forge
section reads as a spotlight environment. The featured card is the hero shot.

## Acceptance criteria

**ForgeProjects section:**
- Section background: `radial-gradient(ellipse at 50% 30%,
  rgba(74,222,128,0.05) 0%, transparent 60%)` — stage light on featured card
- Featured card resolves first (delay 0), medium cards stagger at 0.15s,
  small cards stagger at 0.30s

**ProjectCard — all cards:**
- `border-top: 1px solid rgba(74, 222, 128, 0.12)` — top edge only
- Hover: `translateY(-2px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`
- No scale, no glow, no dramatic effects on hover

**ProjectCard — featured only:**
- Internal padding: `p-8 sm:p-10`
- Metric display: one type step larger
- Terminal panel area: `md:min-h-[280px]`

**KajiLabs:**
- Same reveal motion as ForgeProjects (per-category-group)
- Category titles at `clamp(1.5rem, 3vw, 2.5rem)`
- Top-edge ambient glow on section wrapper (from TICKET-0045)

**Mobile:**
- No translateY on hover (touch devices)
- Vignette: `linear-gradient(to bottom, rgba(74,222,128,0.04) 0%,
  transparent 40%)` on section wrapper only
- Card top-edge glow maintained
