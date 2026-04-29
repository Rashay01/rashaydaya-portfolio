# Recommendations v2 — Technical Vanguard Portfolio

> Design system audit via UI/UX Pro Max | 2026-04-23
> Stack: Next.js 14 · Tailwind CSS 3 · Framer Motion 11 · Three.js

---

## Design System Summary

| Token | Current Value | Role |
|-------|--------------|------|
| `--obsidian` | `#111418` | Background |
| `--satin` | `#E2E8F0` | Primary text / headings |
| `--ash` | `#94A3B8` | Secondary text, muted |
| `--filament` | `#FF5F1F` | CTA, accent orange |
| `--avocatus` | `#2D3E33` | Hover green, skill cells |
| ❌ missing | `#4ade80` | Signal / status green |

**Contrast check (WCAG AA = 4.5:1):**
- `--satin` on `--obsidian` → ~12.5:1 ✅ AAA
- `--ash` on `--obsidian` → ~7.8:1 ✅ AAA
- `--filament` on `--obsidian` → ~4.6:1 ✅ AA (tight — avoid small text)

---

## REC-001 — Add missing `--signal` design token

**Priority:** High | **Effort:** 15 min

`#4ade80` (status green) appears in 6+ files as a raw hex. Add it to the token system.

**`globals.css`:**
```css
:root {
  --obsidian: #111418;
  --satin:    #E2E8F0;
  --ash:      #94A3B8;
  --filament: #FF5F1F;
  --avocatus: #2D3E33;
  --signal:   #4ade80;  /* ← add */
}
```

**`tailwind.config.ts`:**
```ts
colors: {
  obsidian: 'var(--obsidian)',
  satin:    'var(--satin)',
  ash:      'var(--ash)',
  filament: 'var(--filament)',
  avocatus: 'var(--avocatus)',
  signal:   'var(--signal)',   // ← add
},
```

Then replace all `text-[#4ade80]`, `bg-[#4ade80]`, and inline `boxShadow` green with `text-signal`, `bg-signal`.

---

## REC-002 — Respect `prefers-reduced-motion` across all animations

**Priority:** High | **Effort:** 30 min | **WCAG:** 2.3.3

Only the logo animation currently respects this preference. Every component using Framer Motion or CSS animation should check it.

**Pattern to apply in animated sections:**
```tsx
import { useReducedMotion, motion } from 'framer-motion'

export function ZenithHero() {
  const reduced = useReducedMotion()

  // Scroll indicator — skip infinite loop if reduced motion
  return (
    <motion.div
      animate={reduced ? {} : { y: [0, 6, 0] }}
      transition={reduced ? {} : { duration: 2, repeat: Infinity }}
    />
  )
}
```

**`globals.css` — add global rule:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Also:** `animate-pulse` on status badges is decorative. Replace with a static dot that fades in once:
```tsx
// Instead of animate-pulse:
<span className="w-2 h-2 rounded-full bg-signal opacity-80" />
```

---

## REC-003 — Fix all touch targets to minimum 44×44px

**Priority:** High | **Effort:** 20 min | **WCAG:** 2.5.5

| Element | Current | Fix |
|---------|---------|-----|
| Hamburger button | `w-9 h-9` (36px) | `w-11 h-11` (44px) |
| Desktop nav links | `py-2` (32px) | `py-3` (48px) or `min-h-[44px]` |
| Social links (footer) | ~16px | Add `py-2 inline-block` |

```tsx
// Hamburger — SatinCommandNav.tsx
className="md:hidden w-11 h-11 flex flex-col justify-center items-center ..."

// Nav links
className="relative z-10 px-4 py-3 min-h-[44px] flex items-center ..."

// Footer social links
className="py-2 inline-block font-mono text-[11px] text-ash hover:text-satin ..."
```

---

## REC-004 — Make `ProjectCard` properly interactive or non-interactive

**Priority:** High | **Effort:** 20 min

The card has `tabIndex={0}` which makes it focusable via keyboard, but pressing Enter/Space does nothing. Two valid paths:

**Option A — Remove keyboard focus from the article, add a real link:**
```tsx
// Remove tabIndex from article, add a "view details" link inside the card
<article className="relative overflow-hidden ...">
  {/* card content */}
  <a
    href={project.githubUrl || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30 btn-filament"
  >
    View {project.title} on GitHub
  </a>
</article>
```

**Option B — Add `cursor-pointer` and keyboard handler:**
```tsx
<article
  className="... cursor-pointer"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') setHovered(v => !v)
  }}
>
```

Also add `cursor-pointer` to all interactive cards regardless of approach.

---

## REC-005 — Replace Unicode arrow characters with SVG icons

**Priority:** Medium | **Effort:** 30 min

The `↗`, `→`, `←` text characters are used as UI icons throughout. Install Lucide React (already in many Next.js projects) and replace:

```bash
npm install lucide-react
```

```tsx
import { ArrowUpRight, ArrowRight } from 'lucide-react'

// Instead of:
<span className="text-ash/30 ...">↗</span>

// Use:
<ArrowUpRight className="w-4 h-4 text-ash/30" aria-hidden="true" />
```

This ensures consistent sizing, independent color control, and correct accessibility handling.

---

## REC-006 — Consolidate mobile stats display in `ProjectCard`

**Priority:** Medium | **Effort:** 15 min

The current mobile stats row (`md:hidden` section at the bottom) adds clutter to already information-dense small cards. Recommended approach:

- **Featured card only:** Show the 2-stat row on mobile (it has the space)
- **Medium/small cards:** Remove the mobile stats row; the `Metric` component already surfaces the headline number

```tsx
{/* Only show on featured card on mobile */}
{featured && (
  <div className="md:hidden mt-4 pt-4 border-t border-ash/10 flex gap-4 flex-wrap">
    {project.terminal.stats.slice(0, 2).map((stat) => (
      <div key={stat.label}>
        <p className="font-mono text-[10px] text-ash/50 uppercase tracking-[0.08em] mb-0.5">{stat.label}</p>
        <p className="font-mono text-[11px] text-ash">{stat.value}</p>
      </div>
    ))}
  </div>
)}
```

---

## REC-007 — Increase minimum text size from 9px to 10px

**Priority:** Medium | **Effort:** 20 min

`text-[9px]` is below any reasonable readability threshold. Apply these minimum sizes:

| Use case | Current | Recommended |
|----------|---------|-------------|
| Terminal log lines | `text-[9px]` | `text-[10px]` |
| Stat labels | `text-[9px]` | `text-[10px]` |
| Footer copyright | `text-[9px]` | `text-[10px]` |
| Terminal status | `text-[9px]` | `text-[10px]` |

`text-[10px]` is the minimum for decorative/label text. `text-xs` (12px) for any text that conveys essential information.

---

## REC-008 — Add `projectUrl` and `githubUrl` to project data

**Priority:** Medium | **Effort:** 30 min

Project cards currently have no outbound links. Visitors who want to verify the work have no path. Even if repos are private, adding a `null` field makes the intent clear and allows future linking.

**`src/lib/data/projects.ts`:**
```ts
export type ProjectData = {
  // ... existing fields
  githubUrl?: string
  liveUrl?: string
}

export const projects: ProjectData[] = [
  {
    id: 'vanguard-pipeline',
    // ...
    githubUrl: undefined, // private
    liveUrl: undefined,
  },
  {
    id: 'hackathon-ai',
    githubUrl: 'https://github.com/Rashay01/ai-signal-engine',
    liveUrl: undefined,
  },
]
```

Then in `ProjectCard`, render a link when present:
```tsx
{project.githubUrl && (
  <a
    href={project.githubUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="font-mono text-[10px] text-ash/50 hover:text-filament transition-colors duration-200 uppercase tracking-[0.08em]"
    aria-label={`View ${project.title} on GitHub`}
  >
    [ VIEW CODE ]
  </a>
)}
```

---

## REC-009 — Guard `GitHubCTACard` against layout breaks

**Priority:** Medium | **Effort:** 10 min

The GitHub CTA card hardcodes `md:col-span-8` assuming exactly 1 small card (4 cols). If project data changes, the grid will overflow.

```tsx
// ForgeProjects.tsx — compute remaining cols
const TOTAL_COLS = 12
const smallColSpan = 4
const usedCols = small.length * smallColSpan
const remainingCols = TOTAL_COLS - usedCols

// Only show if there's room
{remainingCols > 0 && remainingCols <= 8 && (
  <motion.div className={`sm:col-span-1 md:col-span-${remainingCols}`}>
    <GitHubCTACard />
  </motion.div>
)}
```

Note: For Tailwind JIT safety, use explicit classes or a lookup map instead of template literals.

---

## REC-010 — Add an "About" micro-section between hero and skills

**Priority:** Low | **Effort:** 1–2 hours

Visitors who don't know Rashay Daya have no context from the hero alone. A brief 2-3 sentence bio with key differentiators increases trust and reduces bounce.

**Suggested placement:** Between `ZenithHero` and `ArchiveGrid` — a simple horizontal strip:

```tsx
// src/components/sections/AboutBrief.tsx
export function AboutBrief() {
  return (
    <section className="bg-obsidian border-t border-ash/10 py-10 sm:py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-center">
        <div className="flex-1">
          <p className="text-satin text-[15px] sm:text-base leading-[1.65] tracking-[-0.01em]">
            BSc Computer Science, University of the Witwatersrand. Junior DevOps Engineer
            at Sanlam. SDDA graduate. I build the infrastructure and the interface — owning
            the full stack from pipeline to pixel.
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8 flex-shrink-0">
          <div>
            <p className="font-mono text-[10px] text-ash/50 uppercase tracking-[0.1em] mb-1">Based in</p>
            <p className="font-mono text-[12px] text-ash uppercase tracking-[0.06em]">Johannesburg, ZA</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-ash/50 uppercase tracking-[0.1em] mb-1">Open to</p>
            <p className="font-mono text-[12px] text-signal uppercase tracking-[0.06em]">New roles</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## REC-011 — Confirm CalSans woff2 file is present

**Priority:** Low | **Effort:** 5 min

`globals.css` has a comment: *"Download: https://github.com/calcom/font/raw/main/CalSans-SemiBold.woff2"* — suggesting the file may be missing from `/public/fonts/`. If absent, all display headings fall back to Georgia serif, causing visual regression.

```bash
# Check
ls public/fonts/CalSans-SemiBold.woff2
```

If missing, the fallback in `globals.css` should be updated to a sans-serif that better approximates Cal Sans metrics:
```css
.font-calsans {
  font-family: var(--font-calsans), 'Geist Sans', system-ui, sans-serif;
}
```

---

## Priority Order for Next Sprint

| # | Recommendation | Priority | Effort |
|---|---------------|----------|--------|
| 1 | ISS-001 (already fixed) — z-index terminal panel | 🔴 Critical | Done |
| 2 | REC-002 — `prefers-reduced-motion` | 🟠 High | 30 min |
| 3 | REC-001 — `--signal` token | 🟠 High | 15 min |
| 4 | REC-003 — Touch targets 44px | 🟠 High | 20 min |
| 5 | REC-004 — `ProjectCard` keyboard interactivity | 🟠 High | 20 min |
| 6 | REC-005 — SVG icons | 🟡 Medium | 30 min |
| 7 | REC-007 — Min font size 10px | 🟡 Medium | 20 min |
| 8 | REC-008 — Project URLs in data | 🟡 Medium | 30 min |
| 9 | REC-006 — Mobile stats on featured only | 🟡 Medium | 15 min |
| 10 | REC-010 — About micro-section | 🟢 Low | 1–2 hr |
