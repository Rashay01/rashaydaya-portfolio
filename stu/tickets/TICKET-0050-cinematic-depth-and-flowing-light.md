# TICKET-0050 — Cinematic depth: hero layering and flowing atmospheric light

**Epic:** EPIC-06-cinematic
**Estimate:** M
**Files:**
- `src/components/sections/ZenithHero.tsx`
- `src/components/sections/ForgeProjects.tsx`
- `src/components/sections/KajiLabs.tsx`
- `src/components/sections/ExperienceTimeline.tsx`
- `src/components/ui/AtmosphericLight.tsx` (new)
- `src/app/page.tsx`

## Problem

Two separate issues make the cinematic feel read as copy-paste rather than composed.

### 1. Hero — no depth

The current hero is a flat two-column grid. The artifact and text content
live on the same z-plane. There is nothing overlapping, bleeding, or layered.
A cinematic hero needs depth: elements at different z-levels, slight overlaps,
shadows that feel like physical light casting.

Reference: cosmos.so/explore — content cards overlap the hero boundary, text
rides over imagery, layers feel physical not diagrammatic.

### 2. Atmospheric glow — stamped, not flowing

Every section currently applies the same static gradient at its top edge:

```
radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 70%)
```

Hero, Forge, Experience, Kaji — all identical. As you scroll, each section
looks like a new copy of the same element pasted at the top. The light source
does not feel like one thing casting across the page.

The hero's own glow is at `28% 55%` but every section below resets to
centered-top at the same opacity. The transition from hero into Forge looks
like the light teleported.

## Goal

- Hero feels physically deep: content occupies distinct z-layers with
  meaningful overlap and shadow
- Atmospheric light reads as one source that travels and dims as you scroll
  down, not a repeated header stamp

## Design direction

### Hero depth

Layer model (back to front):

```
Layer 1: black atmosphere (section bg)
Layer 2: AtmosphericLight gradient (fixed, behind everything)
Layer 3: artifact object (z-0)
Layer 4: name bleeding slightly across the artifact column boundary (z-10)
Layer 5: MonoLabel / subtitle / CTA floating above with glass-like depth (z-10)
```

Concrete implementation:
- Artifact column `relative z-0`
- Text column `relative z-10 md:-ml-4 lg:-ml-8` — slight negative margin on
  desktop only so the name bleeds left across the grid column edge
- MonoLabel / subtitle should receive a glass-like depth treatment: low-opacity
  background (`bg-black/30`), soft border (`border-ash/10`), `backdrop-blur-sm`,
  restrained shadow (`shadow-[0_1px_8px_rgba(74,222,128,0.04)]`). It should feel
  like text floating in front of the artifact glow — not a generic rounded SaaS
  badge. Use `rounded-sm` not `rounded-full`.

### Flowing atmospheric light — Option A (preferred)

Create `src/components/ui/AtmosphericLight.tsx` — a `'use client'` component
using Framer Motion `useScroll` + `useTransform` + `useMotionTemplate`.

A single `fixed inset-0 z-0 pointer-events-none` div whose gradient center
point shifts and dims as the page scrolls. Content sections sit above it at
`z-10`.

Scroll values (scrollYProgress 0 → 1):

| Scroll position | x% | y% | opacity |
|---|---|---|---|
| 0 (hero top) | 28 | 45 | 0.06 |
| 0.25 (forge) | 32 | 25 | 0.045 |
| 0.6 (experience) | 55 | 20 | 0.03 |
| 0.85 (kaji) | 58 | 10 | 0.018 |
| 1 (footer) | 60 | 5 | 0 |

Under `prefers-reduced-motion`: render once at hero position (28% 45%, 0.055),
no animation.

```tsx
// AtmosphericLight.tsx — skeleton
'use client'
import { useScroll, useTransform, useMotionTemplate, motion, useReducedMotion } from 'framer-motion'

export function AtmosphericLight() {
  const { scrollYProgress } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  const x = useTransform(scrollYProgress, [0, 0.25, 0.6, 0.85, 1], [28, 32, 55, 58, 60])
  const y = useTransform(scrollYProgress, [0, 0.25, 0.6, 0.85, 1], [45, 25, 20, 10, 5])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.6, 0.85, 1], [0.06, 0.045, 0.03, 0.018, 0])
  const bg = useMotionTemplate`radial-gradient(ellipse 800px 700px at ${x}% ${y}%, rgba(74,222,128,${opacity}) 0%, transparent 65%)`

  if (prefersReducedMotion) {
    return <div aria-hidden className="pointer-events-none fixed inset-0 z-0"
      style={{ background: 'radial-gradient(ellipse 800px 700px at 28% 45%, rgba(74,222,128,0.055) 0%, transparent 65%)' }} />
  }

  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: bg }} />
}
```

In `page.tsx`: add `<AtmosphericLight />` before the main content, wrap
`<main>` contents in a `relative z-10` wrapper (or set `className="relative z-10"`
on main itself).

After adding AtmosphericLight, **remove** the stamped top-edge glow divs from:
- `ForgeProjects.tsx` (both the top-edge glow and the stage-light vignette)
- `ExperienceTimeline.tsx` (top-edge glow)
- `KajiLabs.tsx` (top-edge glow)
- `ZenithHero.tsx` (the hero `absolute inset-0` glow — AtmosphericLight replaces it)

## Acceptance criteria

- [ ] AtmosphericLight is a single fixed layer behind all content; no per-section
      stamps remain for the atmospheric top-edge glow
- [ ] Scrolling from Hero into Forge: the atmospheric light feels continuous,
      not like a new glow appeared at the section top
- [ ] Each section further down has progressively less green atmospheric light,
      feeling like distance from the source
- [ ] On desktop, the hero name visually bleeds across the artifact column
      boundary, creating clear foreground/background layer separation
- [ ] MonoLabel row has glass-like depth treatment (backdrop-blur, soft border,
      low-opacity bg), reads as floating in front of the artifact glow
- [ ] The global light layer must not reduce text contrast or readability in
      any section
- [ ] Reduced-motion users: glow stays at hero position, no animation
- [ ] No layout shift, no horizontal overflow at 375, 768, 1280, 1440px

## Implementation order

1. Create `AtmosphericLight.tsx`
2. Add to `page.tsx`, set `main` to `relative z-10`
3. Remove stamped glow divs from ForgeProjects, ExperienceTimeline, KajiLabs, ZenithHero
4. Add hero depth: z-layering on columns, negative margin on text col, MonoLabel glass treatment
5. Test 375, 768, 1280, 1440px — verify no contrast issues

## Notes

- Use Framer Motion `useScroll` + `useTransform` (not experimental `@scroll-timeline`)
- The atmospheric light should use `pointer-events-none`; must not create horizontal
  overflow; avoid expensive CSS blur on large fixed elements — radial-gradient +
  opacity transforms only, no `filter: blur()` on the light layer
- Design style: Cinematic Utilitarian Tech. One green artifact as light source.
  Dark, precise, restrained. Not neon, not glitch, not generic glass cards.
