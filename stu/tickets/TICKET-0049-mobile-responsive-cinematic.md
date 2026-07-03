# TICKET-0049 — Mobile and responsive cinematic polish

**Epic:** EPIC-06-cinematic
**Estimate:** M
**Files:** All components touched in TICKET-0044 through TICKET-0048

## Goal

Every cinematic change from TICKET-0044–0048 works correctly at all
breakpoints. Mobile gets the same atmosphere with adapted proportions —
not a degraded version, a portrait-native version.

## Breakpoint targets

| | Mobile <768 | Tablet 768–1279 | Desktop 1280+ |
|---|---|---|---|
| Artifact height | 60vw centred | 45vh left col | 55vh left col |
| Hero name | clamp(3rem,14vw,6rem) | clamp(4rem,8vw,8rem) | current large |
| Glow radius | 400px | 600px | 900px |
| Reveal Y offset | 10px | 12px | 16px |
| Reveal duration | 0.45s | 0.5s | 0.6s |
| Section headings | clamp(1.75rem,6vw,2.5rem) | clamp(2rem,4vw,3rem) | clamp(2rem,4vw,3.5rem) |

## Acceptance criteria

- All hero changes from TICKET-0044 render correctly on 375px, 768px, 1280px
- No horizontal overflow introduced at any breakpoint
- No `translateY` hover on touch devices (use `@media (hover: hover)`)
- Atmospheric gradients simplified on mobile (see TICKET-0047 mobile section)
- Page transition fade works on mobile without jank
- Breathing animation does not cause layout shift on any viewport
- Test on: iPhone SE (375), iPhone 14 Pro (393), iPad (768), desktop (1440)

## Notes

- Run Lighthouse mobile after all tickets land — target score should not
  regress from current baseline
- Use browser devtools device emulation to verify each breakpoint before
  declaring done
