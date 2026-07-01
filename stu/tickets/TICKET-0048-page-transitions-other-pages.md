# TICKET-0048 — Page transitions and other pages

**Epic:** EPIC-06-cinematic
**Estimate:** M
**Files:** `src/app/layout.tsx`,
           `src/app/projects/page.tsx`,
           `src/app/projects/[slug]/page.tsx`,
           `src/app/notes/page.tsx`,
           `src/app/now/page.tsx`

## Goal

Every page enters with a consistent cinematic fade. Inner pages inherit the
same typography scale and reveal motion as the homepage.

## Acceptance criteria

**Page transitions (layout.tsx):**
- Wrap page content in `motion.div` with `initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}`, duration 0.3s, ease `[0.16, 1, 0.3, 1]`
- Use `AnimatePresence` with pathname as key
- No exit animation — instant cut out, fade in
- Disabled when `prefers-reduced-motion` is set

**/projects page:**
- Section heading at editorial scale (same clamp from TICKET-0045)
- Project list rows resolve with stagger motion (TICKET-0046 RevealOnScroll)

**/projects/[slug] (case studies):**
- Project name enters with blur-resolve (0.6s) matching hero style
- Content sections below use RevealOnScroll stagger
- No artifact — cinematic from typography + motion alone

**/notes and /now:**
- No artifact glow
- Same page fade transition
- RevealOnScroll on content sections

## Notes

- Next.js App Router: AnimatePresence with pathname key goes in the root
  layout around `{children}`, with `'use client'` on a wrapper component
- Check if existing layout already has any transition wrapper before adding
