# TICKET-0051 — Theatre.js: scroll-driven cinematic animation for the artifact

**Epic:** EPIC-06-cinematic
**Estimate:** L
**Files:** TBD — MonolithScene.tsx, ZenithHero.tsx, potentially a new scroll sequence module

## What it is

Theatre.js (theatrejs.com) is a professional motion design library for the web.
Framework-agnostic, works with React Three Fiber (which the MonolithScene
already uses), THREE.js, HTML/CSS, and SVG.

It provides:
- A visual animation editor (sequence editor, graph editor, dope sheet)
- Easing curve control per keyframe
- Coordinate animations across multiple targets simultaneously
- Can be driven by scroll position (sequence.position = scrollProgress)

## Why it fits

The MonolithScene uses React Three Fiber. Theatre.js integrates directly with
R3F via `@theatre/r3f`. This means the 3D artifact — its camera angle, light
intensity, material properties, rotation — can be keyframed and driven by
scroll position with visual precision, not guesswork in code.

Current state: the artifact has a breathing animation (scale 1 to 1.015, 4s
loop) and sits statically in the hero. There is no scroll choreography on the
3D scene.

## Potential uses

- **Scroll-driven artifact reveal**: as the user scrolls past the hero, the
  artifact's camera zooms out or rotates, handing off to the page atmosphere
- **Hero entrance sequence**: artifact materialises on page load via a
  keyframed Theatre.js sequence (more precise than CSS animations)
- **Section-to-section lighting**: coordinate the artifact's emissive/point
  light intensity with scroll depth — the light dims as the user descends,
  matching the AtmosphericLight fade
- **Visual editing**: tweak the animation timing without touching code,
  using the Theatre.js studio overlay

## Research required before implementation

- [ ] Verify `@theatre/r3f` package is compatible with current Next.js version
      and app router
- [ ] Evaluate bundle size impact (Theatre.js studio should be dev-only,
      core is ~35kb gzip)
- [ ] Decide whether to drive via `useScroll` from Framer Motion (already in
      use) or Theatre.js's own scroll driver — avoid two competing systems
- [ ] Check if MonolithScene can be extended without a full rewrite

## Suggested approach (if approved)

1. Install `@theatre/core` (prod) and `@theatre/r3f` (prod) and
   `@theatre/studio` (dev only, tree-shaken in prod)
2. Wrap MonolithScene's canvas in `<SheetProvider sheet={...}>` from
   `@theatre/r3f`
3. Build a hero entrance sequence (artifact rises, camera settles)
4. Optionally hook sequence.position to useScroll for scroll-driven behavior

## Notes on the other sites evaluated

- **Trophy UI** (ui.trophy.so): gamification component library
  (streaks, achievements, leaderboards). Bright, colorful aesthetic — opposite
  of cinematic dark. Not suitable for this site's design direction. Skip.
- **Threlte** (threlte.xyz): Three.js wrapper for Svelte. This project uses
  React/Next.js. Not compatible. Skip.
- **Peach Web** (peachweb.io): site returned 403 at time of review. Could not
  evaluate. Skip until accessible.
