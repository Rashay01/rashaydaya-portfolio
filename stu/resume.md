# Session resume — feat/theatre-cinematic

**Date:** 2026-07-03
**Branch:** feat/theatre-cinematic (create from feat/cinematic-phase)
**Epic:** EPIC-06-cinematic (stu/epics/EPIC-06-cinematic.md)
**Design spec:** docs/superpowers/specs/2026-07-01-cinematic-phase-design.md

## Creative direction (approved)

Artifact-led cinematic engineering portfolio. Dark, premium, restrained.
One light source (green artifact #4ade80), one lighting family across all
sections. Projects reveal like staged product shots. Apple keynote energy --
each scroll position is a composed shot.

## Tickets

| Ticket | Title | Status |
|---|---|---|
| TICKET-0044 | Hero cinematic overhaul | done |
| TICKET-0045 | Atmospheric page lighting system | done |
| TICKET-0046 | Shared motion reveal system | done |
| TICKET-0047 | Project section spotlight treatment | done |
| TICKET-0048 | Page transitions and other pages | done |
| TICKET-0049 | Mobile and responsive cinematic polish | open |
| TICKET-0050 | Cinematic depth: hero layering and flowing atmospheric light | done |
| TICKET-0051 | Theatre.js: scroll-driven cinematic animation for the artifact | open - next |

## Branch setup for next session

```
git checkout feat/cinematic-phase
git pull origin feat/cinematic-phase
git checkout -b feat/theatre-cinematic
```

## Next step: TICKET-0051

Research and implement Theatre.js for scroll-driven cinematic animation on
the MonolithScene artifact.

Read the full ticket: stu/tickets/TICKET-0051-theatrejs-cinematic-animation.md

Key decisions to make before writing code:
1. Install @theatre/core + @theatre/r3f (prod) and @theatre/studio (dev only)
2. Verify compatibility with current Next.js 16 app router
3. Decide: use Theatre.js scroll driver OR hook sequence.position to
   Framer Motion useScroll (already in codebase) -- avoid two competing
   scroll systems
4. Check MonolithScene.tsx to understand the R3F setup before wrapping it

## What was done last session (TICKET-0050)

- Created AtmosphericLight.tsx: single fixed gradient using useScroll +
  useTransform + useMotionTemplate, shifts x/y and dims as page scrolls
- Moved AtmosphericLight to layout.tsx: was inside PageTransition's
  motion.div which creates a stacking context via will-change:opacity,
  trapping the fixed element. Moving it to body root fixed this.
- Removed bg-obsidian from ZenithHero, ForgeProjects, CapabilityMatrix
  (body already sets it) so the atmospheric layer shows through sections
- Stripped all five identical stamped top-edge glow divs from all sections
- Added hero z-depth: artifact col relative z-0, text col relative z-10
  with md:-ml-4 lg:-ml-8 bleed across grid boundary
- Added MonoLabel glass treatment: backdrop-blur-sm, border-ash/10,
  bg-black/30, shadow
- Added hero bottom-edge gradient fade (transparent -> #111418) to
  connect hero into Forge section visually
- TICKET-0051 written for Theatre.js with full research notes

## PR

https://github.com/Rashay01/rashaydaya-portfolio/pull/30
