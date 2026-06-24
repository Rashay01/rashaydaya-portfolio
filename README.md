# Rashay Daya — Portfolio


Personal portfolio for Rashay Daya, DevOps Engineer and Full Stack Builder. Built on Next.js, TypeScript, Tailwind CSS, Framer Motion, and Three.js.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r166-black?style=flat-square&logo=threedotjs)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF5F1F?style=flat-square&logo=framer&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

**Live:** rashaydaya.co.za
**Status:** Production

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Animation | Framer Motion, GSAP (ScrollTrigger) |
| 3D | Three.js (vanilla, lazy-loaded, desktop only) |
| Diagrams | Mermaid (generated from typed case study data) |
| Email | Resend + React Email |
| Toasts | Sonner |
| Deployment | Cloudflare Pages |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx                  # Fonts, metadata, JSON-LD schemas
│   ├── page.tsx                    # Section composition
│   ├── globals.css                 # Design tokens, typography, global classes
│   ├── icon.tsx, apple-icon.tsx     # Favicons (edge, ImageResponse)
│   ├── opengraph-image.tsx         # OG image (edge, ImageResponse)
│   ├── sitemap.ts, robots.ts       # /sitemap.xml, /robots.txt
│   ├── not-found.tsx
│   ├── api/contact/route.ts        # Contact form handler (Resend, edge)
│   ├── notes/page.tsx              # Published engineering notes index
│   ├── notes/[slug]/page.tsx       # Statically generated note pages
│   ├── now/page.tsx                # /now — current focus + learning, from roadmap.ts
│   ├── projects/
│   │   ├── page.tsx                # /projects index (renders ProjectsView)
│   │   └── [slug]/page.tsx         # Real, statically-generated case study page
│   └── @modal/
│       ├── default.tsx
│       └── (.)projects/[slug]/page.tsx  # Intercepting-route popup over the same content
│
├── components/
│   ├── nav/
│   │   ├── SatinCommandNav.tsx     # Fixed nav, mobile overlay, scroll spy (homepage only)
│   │   └── InnerNav.tsx            # Breadcrumb + CV/contact actions for inner routes
│   ├── sections/
│   │   ├── BootSequence.tsx        # Terminal-style boot intro, plays once before the hero
│   │   ├── ZenithHero.tsx          # Hero + WebGL monolith + sweep reveal
│   │   ├── CapabilityMatrix.tsx    # Skills grid, each category linked to its proof project
│   │   ├── ForgeProjects.tsx       # Bento project grid + live CI/CD terminal
│   │   ├── ExperienceTimeline.tsx
│   │   ├── KajiLabs.tsx            # Kaji Labs section, grouped by category
│   │   └── SignatureFooter.tsx     # DEPLOY. footer, contact CTA
│   ├── projects/
│   │   ├── ProjectsView.tsx        # /projects tech filter + grid (client component)
│   │   ├── CaseStudyContent.tsx    # Shared case study body (page + modal)
│   │   ├── CaseStudyModal.tsx      # Modal chrome for the intercepted route
│   │   ├── ArchitectureDiagram.tsx, MermaidDiagram.tsx  # Mermaid render + a11y text fallback
│   │   ├── PrintButton.tsx         # One-page PDF export trigger
│   │   └── TrustMarkers.tsx
│   ├── three/
│   │   ├── MonolithScene.tsx       # Frosted glass slab (Three.js, desktop)
│   │   └── MonolithSkeleton.tsx    # Loading placeholder
│   └── ui/
│       ├── ContactDialog.tsx, FilamentButton.tsx, ProjectCard.tsx, TerminalPanel.tsx
│       ├── DisplayHeading.tsx      # Display heading (Georgia fallback, see Typography)
│       ├── BorderBeam.tsx, LazyOverlays.tsx
│       └── SectionHeader.tsx, MonoLabel.tsx, Metric.tsx, TechPill.tsx, SkillCell.tsx
│
├── context/ContactContext.tsx      # Global open/close for contact dialog
├── emails/                         # React Email template + rendered HTML
├── hooks/useMediaQuery.ts          # SSR-safe responsive hook (null initial)
└── lib/
    ├── data/                       # projects, case-studies, skills, experience, notes,
    │                               # kaji-labs, roadmap, github-activity, live-pipeline, cv-meta
    ├── hooks/useDialogBehavior.ts  # Shared modal focus/escape/scroll-lock behavior
    ├── security/                   # Contact form rate limiting + validation
    └── seo/structured-data.ts      # JSON-LD builders (Person, WebSite, SoftwareSourceCode,
                                     # BlogPosting, BreadcrumbList)

public/
├── videos/        # ink-swirl.mp4/.webm (DEPLOY. footer) — graceful fallback if absent
├── noise.webp     # Film grain overlay
└── Rashay_Daya_CV.pdf
```

---

## Design tokens

| Token | Value | Role |
|---|---|---|
| `--obsidian` | `#111418` | Page background |
| `--satin` | `#E2E8F0` | Primary text, headings |
| `--ash` | `#94A3B8` | Secondary text, borders |
| `--filament` | `#FF5F1F` | Actions only — CTAs, active states |
| `--avocatus` | `#2D3E33` | Terminal glow, hover states |
| `--signal` / `--signal-glow` | `#4ade80` / `rgba(74,222,128,.7)` | Live status indicators (e.g. live CI pipeline card) |
| `--card` / `--card-deep` / `--card-hover` | `#0d1014` / `#0a0f0c` / `#0f1217` | Card background, nested/recessed panels, hover state |

**Typography:**
- **Syne** (variable, 300–800, self-hosted via `next/font/google`) — logo mark, DEPLOY. heading
- **Cal Sans** — dropped from the stack (see `stu/memory.md`); `.font-calsans` falls back to Georgia
- **Geist Sans** — body copy, UI text
- **JetBrains Mono** — data, metrics, terminal, labels

---

## Development

```bash
npm install
npm run dev        # localhost:3000
npm run build      # production build
```

Requires Node 20+.

---

## Assets required

These are not tracked in git and must be added manually:

| File | Notes |
|---|---|
| `public/Rashay_Daya_CV.pdf` | Linked from nav Download CV button |
| `public/videos/ink-swirl.mp4` + `.webm` | DEPLOY. footer video mask — graceful fallback if absent |

---

## Deployment

Hosted on Cloudflare Pages, built via `@cloudflare/next-on-pages` (`wrangler.toml`,
output `.vercel/output/static`).

Required environment variable: `RESEND_API_KEY`

```bash
npm run pages:preview   # local preview on the Cloudflare Workers runtime
npm run pages:deploy    # build + wrangler pages deploy
```

See `docs/cloudflare-robots-fix.md` for dashboard-side fixes that aren't code changes
(Bot Fight Mode robots.txt injection, render-blocking email-decode script).

---

## Design rules

- **Filament orange is for actions only.** Never headings, decoration, or accents.
- **JetBrains Mono is for data contexts only.** Not body copy or headings.
- **One WebGL canvas.** The monolith is the single 3D element — desktop only, lazy-loaded.
- **Every metric is a real number.** No hedging copy, no buzzwords.
- **Reduced motion respected everywhere.** All animations check `useReducedMotion`.

---

## License

See LICENSE.md. All rights reserved — this codebase is not open source.
