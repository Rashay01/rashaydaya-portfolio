# Rashay Daya — Portfolio


Personal portfolio for Rashay Daya, DevOps Engineer and Full Stack Builder. Built on Next.js, TypeScript, Tailwind CSS, Framer Motion, and Three.js.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r166-black?style=flat-square&logo=threedotjs)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF5F1F?style=flat-square&logo=framer&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-deployed-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

**Live:** rashaydaya.co.za
**Status:** Production

<!-- VERSIONBOT:START -->
![Version](https://img.shields.io/badge/version-v1.0.0-orange?style=flat-square)
<!-- VERSIONBOT:END -->

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Animation | Framer Motion |
| 3D | Three.js (vanilla, lazy-loaded, desktop only) |
| Email | Resend + React Email |
| Deployment | Cloudflare Pages |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx             # Fonts, metadata, JSON-LD schemas
│   ├── page.tsx               # Section composition
│   ├── globals.css            # Design tokens, typography, global classes
│   ├── icon.tsx               # Favicon (edge, ImageResponse)
│   ├── apple-icon.tsx         # Apple touch icon (edge, ImageResponse)
│   ├── opengraph-image.tsx    # OG image (edge, ImageResponse)
│   ├── sitemap.ts             # /sitemap.xml
│   ├── robots.ts              # /robots.txt
│   └── api/contact/route.ts  # Contact form handler (Resend, edge)
│
├── components/
│   ├── nav/
│   │   └── SatinCommandNav.tsx   # Fixed nav, mobile overlay, scroll spy
│   ├── sections/
│   │   ├── ZenithHero.tsx        # Hero + WebGL monolith + sweep reveal
│   │   ├── ArchiveGrid.tsx       # Skills grid
│   │   ├── ForgeProjects.tsx     # Bento project grid + CI/CD terminal
│   │   └── SignatureFooter.tsx   # DEPLOY. footer, contact CTA
│   ├── three/
│   │   └── MonolithScene.tsx     # Frosted glass slab (Three.js, desktop)
│   └── ui/
│       ├── ContactDialog.tsx     # Full-screen contact form with validation
│       ├── FilamentButton.tsx    # Primary CTA button
│       ├── ProjectCard.tsx       # Bento card + terminal hover panel
│       ├── TerminalPanel.tsx     # Terminal log component
│       ├── DisplayHeading.tsx    # Cal Sans display heading
│       ├── SectionHeader.tsx     # Eyebrow + heading + description
│       ├── MonoLabel.tsx         # JetBrains Mono label
│       ├── Metric.tsx            # Label + value stat block
│       ├── TechPill.tsx          # Tech stack badge
│       └── SkillCell.tsx         # Skill row
│
├── context/
│   └── ContactContext.tsx        # Global open/close for contact dialog
│
├── emails/
│   └── ContactEmail.tsx          # React Email template
│
├── hooks/
│   └── useMediaQuery.ts          # SSR-safe responsive hook (null initial)
│
└── lib/data/
    ├── projects.ts               # Project content + terminal data
    └── skills.ts                 # Skill categories

public/
├── fonts/CalSans-SemiBold.woff2  # Display heading font (see Assets)
├── videos/                       # ink-swirl.mp4/.webm (DEPLOY. footer)
└── noise.png                     # Film grain overlay
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
| `--signal` | `#4ade80` | Live status indicators |
| `--card` | `#0d1014` | Card background |

**Typography:**
- **Syne** (variable, 300–800) — logo mark, DEPLOY. heading
- **Cal Sans** (600) — display headings (H1/H2)
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
| `public/fonts/CalSans-SemiBold.woff2` | Download from github.com/calcom/font — falls back to Georgia |
| `public/Rashay_Daya_CV.pdf` | Linked from nav Download CV button |
| `public/videos/ink-swirl.mp4` + `.webm` | DEPLOY. footer video mask — graceful fallback if absent |

---

## Deployment

Hosted on Cloudflare Pages. See `docs/deploy-cloudflare.md` for full setup.

Required environment variable: `RESEND_API_KEY`

```bash
# Local preview on Cloudflare Workers runtime
npm run pages:preview
```

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

---

## Phase 2

- `CMD+K` command palette (`/help`, `cat resume.pdf`, `whoami`, `ls projects`)
- Case study expansion page for one featured project
- Font subsetting — Syne and Cal Sans under 15kb each
- Lighthouse Mobile score 90+
- Blog / writing section (MDX)
