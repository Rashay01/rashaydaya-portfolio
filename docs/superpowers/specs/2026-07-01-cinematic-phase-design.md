# Phase 6 — Cinematic redesign spec (2026-07-01)

## Creative direction

Artifact-led cinematic engineering portfolio. Dark, premium, restrained.
The green artifact is the site's light source and identity system. Projects
reveal like staged product shots. Content remains clear, credible, technical.

Tone: cinematic + premium + restrained + technical.
Avoid: sci-fi noise, visible halos, heavy particles, scroll-lock intros,
springy bounces, SaaS hover effects, neon borders.

---

## Section 1 — Hero (ZenithHero)

### Artifact
- Scale from current ~200px accent to fill ~55% of viewport height on desktop,
  45% on tablet, 60vw height centred on mobile.
- Remove bottom-left positioning. Centre the artifact vertically in the left
  column.
- Behind the artifact: CSS radial gradient, colour `#4ade80`, opacity 4–6%,
  spread wide (800–1000px radius). This is environmental lighting, not a halo.
- The gradient bleeds downward past the hero fold so the section below feels
  lit from above. Achieved with a fixed or absolute positioned gradient div
  that extends ~200px below the hero boundary.
- Breathing animation: `scale(1) → scale(1.015)` synced with glow opacity
  shift (4% → 6%), 4s loop, `ease-in-out`. Disabled when
  `prefers-reduced-motion` is set.

### Name entrance
- "Rashay" enters first: `opacity: 0, filter: blur(8px)` →
  `opacity: 1, filter: blur(0)`, duration 0.8s, ease `[0.16, 1, 0.3, 1]`.
- "Daya" follows 0.2s behind with identical animation.
- Mono subtitle enters 0.4s after "Daya".
- CTAs and proof links enter 0.2s after subtitle.
- No bounce, no Y translation on the name itself — pure resolve.
- All disabled (immediate render) when `prefers-reduced-motion` is set.

### Layout
- Right column (description, CTAs, links) sits mid-height, vertically
  centred relative to the artifact. Not pinned to top.
- Bottom viewport void eliminated by artifact height and glow field anchoring
  the full column.

### Mobile
- Artifact: full width, `height: 60vw`, centred at top of hero.
- Name stacks below, `font-size: clamp(3rem, 14vw, 6rem)`.
- Right column content sits below the name as a single column stack.
- Glow maintained at reduced spread (~400px radius) centred on artifact.

---

## Section 2 — Atmospheric continuity

### Lighting language
- A hero-origin radial gradient (`#4ade80`, ~5% opacity, 900px radius) is
  anchored to the artifact's position and fades naturally past the hero fold.
  Implemented as an absolutely positioned div behind hero content.
- Each major section (`#forge`, `#kaji-labs`, `#experience`) receives a
  top-edge ambient glow: `background: radial-gradient(ellipse at 50% 0%,
  rgba(74,222,128,0.04) 0%, transparent 60%)`. Applied as a `::before`
  pseudo-element or wrapper div on each section.
- No section has its own colour identity. One light source, one colour family.

### Section headings
- Section titles ("The Forge.", "Open-source DevOps tooling.",
  "Open positions.", etc.) step up in scale to feel like chapter titles.
- Target: `font-size: clamp(2rem, 4vw, 3.5rem)` for primary section headings.
- Line height tight (`leading-none` or `leading-[0.95]`).
- Tracking `-0.03em` for editorial weight.

### Motion language (shared across all sections)
- One consistent reveal: `opacity: 0, translateY: 16px` →
  `opacity: 1, translateY: 0`, duration 0.6s, ease `[0.16, 1, 0.3, 1]`.
- Stagger between child elements: 0.12s.
- Section container does not move — only content resolves.
- Triggered by Framer Motion `useInView` with `once: true, margin: '-80px'`.
- Mobile overrides: Y offset 10px, duration 0.45s.
- All disabled when `prefers-reduced-motion` is set.

---

## Section 3 — Project section spotlight treatment

### ForgeProjects section
- Section background gets a centred radial vignette: `radial-gradient(ellipse
  at 50% 30%, rgba(74,222,128,0.05) 0%, transparent 60%)` — a stage light
  aimed at the featured card area.
- Featured card resolves first (no delay). Supporting cards stagger 0.15s
  behind as groups (medium cards as a group, small cards as a group).

### Card top-edge glow
- All project cards gain `border-top: 1px solid rgba(74,222,128,0.12)` —
  the artifact's light catching the top of each card.
- No full neon border. Top edge only.

### Card hover
- `translateY(-2px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`.
- Duration 200ms, ease-out.
- No scale, no glow on hover, no dramatic lift.

### Featured card "hero shot"
- Extra internal padding: `p-8 sm:p-10` vs standard `p-5 sm:p-6`.
- Metric display: larger type size (one step up from current).
- Terminal panel area (desktop): `min-h-[280px]` vs current `230px`.
- Feels like a case study preview, not a tile.

### Kaji Labs
- Same motion language: per-category-group resolve.
- Category titles: stronger scale, same chapter-title treatment as section
  headings (slightly smaller — `clamp(1.5rem, 3vw, 2.5rem)`).

### Mobile
- Single column, same motion, Y offset 10px, duration 0.45s.
- Vignette simplified: `background: linear-gradient(to bottom,
  rgba(74,222,128,0.04) 0%, transparent 40%)` on section wrapper.
- Card top-edge glow maintained.
- No translateY hover on touch devices.

---

## Section 4 — Page transitions and other pages

### Page transitions
- `motion.div` wrapping page content in root layout.
- `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` at 0.3s,
  ease `[0.16, 1, 0.3, 1]`.
- No exit animation — instant cut out, fade in.
- Disabled when `prefers-reduced-motion` is set.
- Implemented via Framer Motion `AnimatePresence` in layout with a key on
  the pathname.

### Other pages

**/projects**
- Section heading at editorial scale.
- Filter row stays clean (already done).
- Project list resolves with same stagger motion.
- Page inherits atmospheric language via section top-edge gradients.

**/projects/[slug] (case studies)**
- Project name enters as a cinematic title: same blur-resolve animation as
  the hero name, slightly faster (0.6s).
- Content sections below use the same stagger reveal.
- No artifact — cinematic feel comes from typography scale and motion alone.

**/notes and /now**
- No artifact glow — simpler pages keep atmospheric feel through typography
  scale and consistent reveal motion only.
- Same page transition applies.

---

## Responsive breakpoints summary

| Element | Mobile (<768) | Tablet (768–1279) | Desktop (1280+) |
|---|---|---|---|
| Artifact height | 60vw centred | 45vh left col | 55vh left col |
| Hero name size | clamp(3rem,14vw,6rem) | clamp(4rem,8vw,8rem) | current (large) |
| Glow radius | 400px | 600px | 900px |
| Section reveal Y | 10px | 12px | 16px |
| Reveal duration | 0.45s | 0.5s | 0.6s |
| Section headings | clamp(1.75rem,6vw,2.5rem) | clamp(2rem,4vw,3rem) | clamp(2rem,4vw,3.5rem) |

---

## Implementation notes

- All animations via Framer Motion (already installed). No new animation dep.
- All glow/atmospheric effects via CSS (radial-gradient). No canvas, no WebGL.
- `prefers-reduced-motion` respected on every animated element.
- Existing `useDialogBehavior`, `useInView` patterns followed.
- No structural rebuild of any section — changes are additive: scale,
  positioning, gradient, motion.
- Performance: gradients are GPU-composited. Framer Motion layout animations
  avoided (no `layout` prop needed here). No JS-driven scroll listeners.

---

## Out of scope

- Scroll-lock hero intro sequences.
- Particle systems or canvas effects.
- Per-section colour identities.
- Heavy parallax.
- New dependencies.
