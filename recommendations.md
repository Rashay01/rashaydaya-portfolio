# Technical Vanguard — Recommendations

A prioritised set of improvements to push the portfolio toward truly premium, modern-minimal, and skill-differentiating territory. Items are grouped by impact area and ordered roughly by effort-to-return ratio.

---

## 1. Brand & Visual Identity

### 1.1 Missing Assets — Fix First
These gaps silently break the premium feel right now:

| Asset | Path | Impact |
|---|---|---|
| Cal Sans font file | `/public/fonts/CalSans-SemiBold.woff2` | DisplayHeading falls back to Georgia — breaks the typeface hierarchy |
| Film grain overlay | `/public/noise.png` | Body grain disappears entirely; flat blacks on OLED look cheap |
| DEPLOY video mask | `/public/videos/ink-swirl.webm` + `.mp4` | The entire video-clip-path effect on the footer is inert |
| Favicon + app icons | `/public/favicon.ico`, `/public/apple-touch-icon.png` | Browser tab shows a blank icon — low-effort, high-credibility fix |

Download Cal Sans: https://github.com/calcom/font/raw/main/CalSans-SemiBold.woff2  
Source a free seamless noise PNG (e.g. grainy.app export at 256 × 256, opacity 0.03).

### 1.2 Cursor Trail / Magnetic Interactions (Desktop)
A soft circular cursor follower (10–14px, filament-tinted, ~60–80ms easing lag) makes the site feel handcrafted and alive. Limit to `pointer: fine` devices so it never triggers on touch.

```tsx
// Implementation sketch
import { useEffect, useRef } from 'react'
// Track mouse → lerp a position → render a fixed div
```

Pair with **magnetic button** behaviour on FilamentButton: the button subtly follows the cursor when within 40px, using a `translate` transform. This is a single hook that many premium agencies use — it immediately elevates the tactile feel.

### 1.3 Ambient Scroll Gradient
The site is currently a flat obsidian (#111418) from top to bottom. Add a very subtle background progression:
- Hero → pure obsidian
- Archive → faint avocatus tint (rgba(45,62,51, 0.06))
- Forge → back to obsidian with a cold blue undertone
- Footer → obsidian; the DEPLOY glow provides the warmth

This gives the page a narrative arc — you feel the sections change without visible borders.

### 1.4 Section Separators
Replace the invisible transitions between sections with a single 1px `bg-ash/8` horizontal rule + a small `MonoLabel` indexing the section: `— 01 / HERO`, `— 02 / ARCHIVE`, etc. This is a common move in high-end agency portfolios and immediately reads as intentional.

### 1.5 Filament Accent Underuse
The orange (#FF5F1F) currently only appears on the FilamentButton and the sweep-line animation. Consider:
- A thin left-border filament stripe on the featured project card
- Filament-coloured hover state on social links in the footer
- A subtle filament dot on the active nav item
Consistency of accent use = cohesion.

---

## 2. Content Strategy

### 2.1 Prove the Metrics
The 99.8% efficiency, 99.9% uptime, 0.02s deployment numbers are powerful — but only if users trust them. Add a `[?]` icon next to each metric that opens a small tooltip explaining the source:

```
99.9% UPTIME
"Measured via UptimeRobot over 12 months across Vanguard Pipeline
prod environment. Zero unplanned incidents Q1–Q4 2024."
```

This transforms impressive numbers into credible engineering evidence.

### 2.2 Add a Timeline / Experience Strip
A compact horizontal (desktop) / vertical (mobile) timeline between the Archive and Forge sections:

```
2021 ──── BSc Computer Science, Wits
2022 ──── SDDA Graduate Certificate
2023 ──── Junior DevOps, Sanlam
2024 ──── Platinum Plus Pipeline (live)
2025 → NOW ──── Building Technical Vanguard
```

This single component answers the recruiter's first question ("where are you in your career?") without a separate About page.

### 2.3 Case Study Depth
The Vanguard Pipeline card is the strongest project. Consider adding a `/projects/vanguard-pipeline` route with a full case study:
- Problem statement
- Architecture diagram (even ASCII art or a simple Mermaid diagram)
- Before / After metrics
- Key decisions and trade-offs

A single well-written case study does more for perceived seniority than 10 surface-level project cards.

### 2.4 Open Source Callout
Even small contributions matter. A minimal section — "Code in the Wild" or "OSS" — listing any public repos, PRs merged into external projects, or tools published, signals community engagement and confidence in showing your work.

### 2.5 Contact Form (Not Just Email Link)
The current CTA opens the user's mail client. Most visitors won't follow through. A simple form (name, email, message) integrated with **Resend** (free tier, excellent Next.js support) or **Formspree** converts significantly better and lets you control the experience. Keep it minimal — three fields maximum.

---

## 3. Technical Quality

### 3.1 Proper OG Image
Currently there is no `opengraph-image.tsx` route. When the portfolio URL is shared on LinkedIn or Slack, it shows a generic blank preview. Add a server-rendered OG image at `/app/opengraph-image.tsx`:

```tsx
// /app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export default function OGImage() {
  return new ImageResponse(
    <div style={{ background: '#111418', /* ... */ }}>
      <h1>Rashay Daya</h1>
      <p>DevOps & Full Stack Developer</p>
    </div>
  )
}
```

This single file dramatically improves how the portfolio looks when shared — it's a 30-minute investment with outsized social media impact.

### 3.2 Sitemap + robots.txt
Add auto-generated files:

```ts
// /app/sitemap.ts
export default function sitemap() {
  return [{ url: 'https://rashaydaya.dev', lastModified: new Date() }]
}
```

```ts
// /app/robots.ts
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://rashaydaya.dev/sitemap.xml' }
}
```

Combined, these take under 10 minutes and directly improve Google discoverability.

### 3.3 WebGL Error Boundary
The MonolithScene has no error boundary. If `@react-three/fiber` throws (older devices, WebGL disabled in enterprise browsers), the entire left column crashes silently. Wrap it:

```tsx
// /components/three/MonolithBoundary.tsx
'use client'
import { Component, ReactNode } from 'react'
export class MonolithBoundary extends Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { errored: false }
  static getDerivedStateFromError() { return { errored: true } }
  render() { return this.state.errored ? this.props.fallback : this.props.children }
}
```

Wrap `<MonolithScene />` in this and reuse the existing typographic fallback as the `fallback` prop.

### 3.4 Performance Audit Targets
Run `next build && npx @next/bundle-analyzer` and check:
- Three.js is ~600KB gzipped — confirm it's not in the main bundle (the `dynamic()` import should tree-shake it)
- Framer Motion is ~50KB — acceptable but watch for animation-heavy pages

Target Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices 100.

### 3.5 Reduced-Motion Coverage
The current `prefers-reduced-motion` rule only covers `.logo-mark`. Extend it to disable Framer Motion animations:

```tsx
// In layout or a global provider
import { MotionConfig } from 'framer-motion'
const reducedMotion = useReducedMotion()
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

This is a one-line change in `layout.tsx` that satisfies WCAG 2.1 SC 2.3.3 and passes accessibility audits.

### 3.6 Analytics (Privacy-Respecting)
Add **Vercel Analytics** (zero-config, GDPR-compliant) or **Plausible** (self-hostable). Knowing which section gets the most scroll depth, which projects get hovered, and where visitors drop off lets you iterate the portfolio with data rather than intuition.

---

## 4. Unique Differentiators

These are higher-effort but create genuine standout moments.

### 4.1 Live System Status Panel
Connect the hero metrics to real data. UptimeRobot and GitHub have free public APIs:

```
99.9% UPTIME  ←  live from UptimeRobot monitor
↑ verified · last checked 2m ago
```

This turns a static claim into a live dashboard — exactly the kind of thing a DevOps engineer should demonstrate. It proves you actually run monitored systems, not just claim to.

### 4.2 Interactive Terminal (Easter Egg)
Add a keyboard shortcut (`Ctrl/Cmd + K` or `` ` ``) that opens a site-wide command palette styled as a terminal. Commands could include:

```
> whoami       → short bio
> ls projects  → list all projects
> cat cv       → opens CV PDF
> contact      → opens contact form
> clear        → clears terminal
```

This is a signature moment — the kind of interaction that gets shared. For a DevOps engineer's portfolio it's perfectly on-brand.

### 4.3 Architecture Diagram Section
Add a visual "System Architecture" view of the Vanguard Pipeline project — even a simple SVG diagram showing the CI/CD flow from commit to deploy. Animated draw-on-scroll (stroke-dashoffset animation) makes it cinematic. This demonstrates both technical depth and visual communication ability — a rare combination.

### 4.4 Blog / Technical Writing
A `/writing` route with even 2–3 articles positions you as a practitioner who reflects on their craft. Suggested topics:
- "How I achieved 99.9% uptime on a Flask/AWS stack"
- "Zero-downtime deployments with GitHub Actions: lessons from production"
- "Monolith to microservices: what I'd do differently"

Technical writing is the highest-leverage career differentiator at the junior-to-mid transition point.

### 4.5 Shareable CV PDF
Generate the CV as a styled PDF from the same design system — matching typefaces, color palette, layout conventions. Tools: `puppeteer` or `react-pdf`. Accessible via `[ CV ]` button in the nav. A CV that visually matches the portfolio signals that this person has a personal brand, not just a GitHub account.

---

## 5. Quick Wins (< 1 hour each)

| Task | Why |
|---|---|
| Add `<link rel="preconnect" href="https://fonts.googleapis.com" />` to `<head>` | Speeds up Google Font loads by ~200ms |
| Replace the `↗` arrow unicode with an `<svg>` icon on ProjectCard | Renders crisply at all DPIs; the unicode glyph is fuzzy on retina |
| Add `loading="lazy"` to any future `<img>` tags | LCP improvement |
| Add a `title` attribute to each social link | Screen reader accessibility + browser tooltip |
| Prefix all `console.log` debugging with `[TV]` and strip in production | `process.env.NODE_ENV !== 'production'` guard |
| Add `<meta name="theme-color" content="#111418" />` | Browser chrome matches site on mobile Safari/Chrome |

---

## 6. Phase 2 Roadmap (Longer-Term)

1. **Project Detail Pages** — Dynamic routes `/projects/[slug]` with full case studies, inline code snippets, and architecture diagrams
2. **Skills Graph** — Interactive D3 or canvas-based skill relationship map (not just a tag cloud)
3. **Dark → Adapt** — Keep dark as default but add a `[system]` / `[dark]` / `[light]` toggle. Light mode variant uses `#F8F5F0` (warm paper) instead of white — stays luxurious
4. **Hire Me Flow** — Replace the single email CTA with a proper multi-step intake: "What are you building?" → "Timeline" → "Contact" — pre-qualifies conversations
5. **3D Skills Sphere** — Replace the Archive grid with a rotating 3D sphere of technology logos rendered in R3F. Interactive: click a skill → cards filter to show relevant projects
6. **Real-Time GitHub Activity** — Fetch recent commit activity from the GitHub API and render it as a live activity feed in the footer or Archive section

---

*Generated 2026-04-18 — revisit quarterly as the portfolio evolves.*
