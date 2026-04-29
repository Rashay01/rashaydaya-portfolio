# Issues Audit — Technical Vanguard Portfolio

> Audited: 2026-04-23 | Stack: Next.js 14 / Tailwind CSS 3 / Framer Motion 11
> Severity: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## 🔴 Critical

### ISS-001 — Terminal hover panel rendered behind card content (FIXED)
**File:** `src/components/ui/ProjectCard.tsx`
**Symptom:** On hover, terminal panel slides up but card content (metric values, status badge) renders on top of it — causing visual overlap and making both layers unreadable.
**Root cause:** Card content wrapper has `z-10`; terminal panel had no explicit z-index, defaulting to `z-auto` (0 in stacking context). Panel rendered behind content.
**Fix applied:** Added `z-20` to the terminal panel `div`.
```tsx
// Before
className={`hidden md:block absolute inset-x-0 bottom-0 ...`}
// After
className={`hidden md:block absolute inset-x-0 bottom-0 z-20 ...`}
```

---

## 🟠 High

### ISS-002 — Hamburger button below minimum touch target (44×44px)
**File:** `src/components/nav/SatinCommandNav.tsx:107`
**Current:** `w-9 h-9` = 36×36px
**Required:** Minimum 44×44px per WCAG 2.5.5 (AAA) and Apple/Google HIG
**Impact:** Missed taps on mobile, degraded UX for users with motor impairments.
```tsx
// Fix: increase to w-11 h-11 (44px)
className="md:hidden w-11 h-11 ..."
```

### ISS-003 — Desktop nav link touch targets below 44px
**File:** `src/components/nav/SatinCommandNav.tsx:~80`
**Current:** `py-2` = 32px height
**Fix:** `py-3` (48px) or add `min-h-[44px]` to nav link `<a>` elements.

### ISS-004 — `prefers-reduced-motion` only guards logo animation; all Framer Motion is unguarded
**File:** `src/app/globals.css:108`, all section + hero components
**Current:** Only `.logo-mark` respects `prefers-reduced-motion`. Hero sweep, scroll indicator infinite loop, section entrance animations, mobile menu transitions, and `animate-pulse` badges all fire regardless.
**Impact:** Can trigger vestibular disorders (WCAG 2.3.3 failure).
**Fix:** Use Framer Motion's `useReducedMotion()` hook at the top of `ZenithHero` and `SatinCommandNav` and conditionally disable animations:
```tsx
import { useReducedMotion } from 'framer-motion'
const reduced = useReducedMotion()
// then: animate={reduced ? {} : { y: [0, 6, 0] }}
```

### ISS-005 — `animate-pulse` used on decorative status badges
**Files:** `src/components/ui/ProjectCard.tsx:64`, `src/components/ui/TerminalPanel.tsx:57`, `src/components/sections/SignatureFooter.tsx:34`
**Guideline:** UX best practice — use continuous animation for loading states only, not decorative elements. Decorative `animate-pulse` is distracting and violates `prefers-reduced-motion`.
**Fix:** Replace with a static `opacity-75` dot or a one-shot fade-in animation.

### ISS-006 — `ProjectCard` focusable but has no keyboard activation
**File:** `src/components/ui/ProjectCard.tsx:27`
**Current:** `tabIndex={0}` on `<article>` element shows terminal on `onFocus`, but keyboard users cannot "activate" the card (Enter/Space do nothing). The card has no link/button inside the focusable surface.
**Impact:** Screen reader announces a focusable element with no actionable role — confusing and non-functional.
**Fix:** Either remove `tabIndex={0}` (rely on inner elements for focus) or add a visually-hidden button/link inside the card that activates the terminal or links to the project.

### ISS-007 — `cursor-pointer` missing on `ProjectCard`
**File:** `src/components/ui/ProjectCard.tsx`
**Current:** `<article>` element has hover states but no `cursor-pointer`.
**Impact:** Default cursor on an interactive element misleads the user — doesn't signal interactivity.
**Fix:** Add `cursor-default md:cursor-pointer` to the article's className.

---

## 🟡 Medium

### ISS-008 — Sub-10px text in multiple components
**Files:** `TerminalPanel.tsx:60,67`, `ProjectCard.tsx:65,102`, `SignatureFooter.tsx:123`
**Current:** `text-[9px]` used for terminal line labels, stat labels, footer copyright.
**Guideline:** WCAG 1.4.4 requires text to be resizable; sub-10px text is below any reasonable readability threshold even on high-DPI screens.
**Fix:** Minimum `text-[10px]` for decorative labels; `text-xs` (12px) for all user-readable content.

### ISS-009 — Hardcoded `#4ade80` green outside design token system
**Files:** `ProjectCard.tsx:64-65`, `TerminalPanel.tsx:57-60`, `SignatureFooter.tsx:34-35`, `globals.css` (missing)
**Current:** Green status color `#4ade80` is repeated as a raw hex string in at least 6 places.
**Impact:** Cannot update brand consistently; no design token name makes intent unclear.
**Fix:** Add `--signal: #4ade80` to `:root` in `globals.css` and extend `tailwind.config.ts`:
```ts
signal: 'var(--signal)',
```
Then replace all `text-[#4ade80]` / `bg-[#4ade80]` with `text-signal` / `bg-signal`.

### ISS-010 — `GitHubCTACard` always renders regardless of project row balance
**File:** `src/components/sections/ForgeProjects.tsx`
**Current:** GitHub CTA card is hardcoded as `md:col-span-8` and always rendered, assuming exactly 1 small card occupies 4 cols. Adding more projects will break the 12-column grid.
**Fix:** Make the CTA conditional or compute remaining cols dynamically.

### ISS-011 — `border-ash/8` is a non-standard Tailwind opacity value
**File:** `src/components/sections/ForgeProjects.tsx:131`
**Current:** `border-ash/8` — Tailwind's JIT will generate this but it's not in the default scale and is easy to mistype.
**Fix:** Use `border-ash/10` for consistency with the rest of the codebase.

### ISS-012 — `active-dot` and `nav-pill` both use `layoutId` — potential conflict
**File:** `src/components/nav/SatinCommandNav.tsx`
**Current:** `layoutId="nav-pill"` animates the hover highlight; `layoutId="active-dot"` animates the scroll-active indicator. Both use `AnimatePresence` on the same nav item level — if both are present simultaneously, Framer Motion may stutter.
**Fix:** Ensure only one `layoutId` group is active at a time, or use separate motion components that don't share layout context.

### ISS-013 — Mobile stats row in `ProjectCard` adds clutter on small cards
**File:** `src/components/ui/ProjectCard.tsx:96-105`
**Current:** Mobile stat labels use `text-[9px]` and `text-[11px]` below the metric. On small cards (`min-h-[260px]`), this makes the card dense and crowded.
**Fix:** Only show mobile stats on `featured` cards, or remove them and rely on the always-visible `Metric` component.

### ISS-014 — `↗` and `→` are Unicode text characters used as icons
**Files:** `SatinCommandNav.tsx:162`, `ForgeProjects.tsx:142`, `SignatureFooter.tsx` (various)
**Guideline:** UI Pro Max rule — use SVG icons (Heroicons/Lucide), not text characters or emojis.
**Impact:** Text arrow characters don't scale consistently, can't be styled independently, and may render differently across OS/browser.
**Fix:** Replace with Lucide `<ArrowUpRight />` or `<ArrowRight />` SVG components.

---

## 🟢 Low

### ISS-015 — Video `onError` in footer hides element but leaves layout gap
**File:** `src/components/sections/SignatureFooter.tsx:84`
**Current:** `onError={(e) => e.currentTarget.style.display = 'none'}` hides the video but leaves the containing `div` in place with `isolation: isolate` potentially affecting layout.
**Fix:** Also hide the parent container, or use CSS `display:none` on the wrapper via a state variable.

### ISS-016 — CalSans fallback chain only uses `Georgia, serif`
**File:** `src/app/globals.css:74`
**Current:** `.font-calsans { font-family: var(--font-calsans), Georgia, serif; }`
**Issue:** If the `.woff2` file is absent (documented in the file header itself), headings fall back to Georgia — a serif with completely different metrics and weight — causing layout shift.
**Fix:** Use `system-ui` or `sans-serif` as fallback to reduce metric mismatch while maintaining sans-serif appearance. Or confirm file is present in `/public/fonts/`.

### ISS-017 — Social link touch targets in footer are undersized
**File:** `src/components/sections/SignatureFooter.tsx:114`
**Current:** `text-[10px]` links with no explicit height — renders at ~16-18px height.
**Fix:** Add `py-2 inline-block` to each social link to meet the 44px touch target guideline.

### ISS-018 — `IntersectionObserver` in nav attaches on mount before sections exist
**File:** `src/components/nav/SatinCommandNav.tsx:~22`
**Current:** `useEffect` with `[]` dependency runs on mount. If sections haven't rendered (deferred/dynamic), `document.getElementById(id)` returns `null` and observer is silently skipped.
**Impact:** Active section highlighting may not work after cold loads or in SSR hydration.
**Fix:** Add a `null` guard log or add `document.readyState` check; the current `if (!el) return` guard handles this silently but the issue should be acknowledged.

### ISS-019 — `h-full` removed from card inner div may cause height regression on featured card
**File:** `src/components/ui/ProjectCard.tsx:55`
**Current change:** Outer article is `flex flex-col`; inner content div is `flex-1` (added in redesign). The featured card previously used `h-full` explicitly to fill the container. Confirm the card still fills its `min-h-[420px]` container on desktop.
