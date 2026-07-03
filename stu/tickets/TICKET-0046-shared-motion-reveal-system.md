# TICKET-0046 — Shared motion reveal system

**Epic:** EPIC-06-cinematic
**Estimate:** M
**Files:** `src/components/ui/RevealOnScroll.tsx` (new),
           all section components

## Goal

One consistent motion language across every section reveal. Content resolves
into view like a spotlight coming up on a stage — no elements flying in,
no bounce, no per-section custom timing.

## Acceptance criteria

- Create `RevealOnScroll` wrapper component:
  - `initial={{ opacity: 0, y: 16 }}`
  - `animate={{ opacity: 1, y: 0 }}`
  - Duration 0.6s, ease `[0.16, 1, 0.3, 1]`
  - `useInView` with `once: true, margin: '-80px'`
  - Accepts `delay` prop for stagger (default 0)
  - Respects `prefers-reduced-motion` (renders children immediately)
- Section containers do NOT move — only their children use `RevealOnScroll`
- Stagger between sibling children: 0.12s increments via `delay` prop
- Replace existing per-section `useInView` + `motion.div` patterns with
  `RevealOnScroll` where appropriate
- Mobile: component accepts `mobileY` prop (default 10) and
  `mobileDuration` prop (default 0.45)

## Notes

- Audit existing ForgeProjects, KajiLabs, ExperienceTimeline for current
  animation patterns before replacing — some may already be correct
- `RevealOnScroll` is the single source of truth for reveal motion
