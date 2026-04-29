# Technical Vanguard

> A cinematic developer portfolio functioning as a technical manifesto. Built on Next.js 14, TypeScript, Tailwind, Framer Motion, and React Three Fiber.

**Persona:** Rashay Daya — DevOps & Full Stack Developer
**Design Language:** Satin Minimalist / Industrial Luxury
**Status:** Phase 1 production build

---

## Architecture

```
src/
├── app/                       # Next.js App Router entry
│   ├── layout.tsx             # Fonts, metadata, JSON-LD Person schema
│   ├── page.tsx               # Section composition
│   └── globals.css            # Design tokens, typography, reusable classes
│
├── components/
│   ├── nav/
│   │   └── SatinCommandNav.tsx
│   ├── sections/              # Page sections
│   │   ├── ZenithHero.tsx     # Hero + 3D monolith + sweep reveal
│   │   ├── ArchiveGrid.tsx    # Skills (visual rest)
│   │   ├── ForgeProjects.tsx  # Bento project grid + CI/CD terminal hover
│   │   └── SignatureFooter.tsx # DEPLOY. footer with video mask
│   ├── three/
│   │   └── MonolithScene.tsx  # R3F frosted glass slab (lazy, desktop only)
│   └── ui/                    # Reusable primitives
│       ├── FilamentButton.tsx # Outlined filament CTA
│       ├── MonoLabel.tsx      # JetBrains Mono tracked label
│       ├── DisplayHeading.tsx # Cal Sans responsive heading
│       ├── SectionHeader.tsx  # Eyebrow + heading + description
│       ├── Metric.tsx         # Label-over-value block
│       ├── TechPill.tsx       # Tech stack identifier
│       ├── SkillCell.tsx      # Skill row with avocatus hover
│       ├── ProjectCard.tsx    # Bento card + terminal reveal
│       └── TerminalPanel.tsx  # Frosted terminal log block
│
├── hooks/
│   └── useMediaQuery.ts       # Responsive breakpoint hook
│
└── lib/
    └── data/                  # Static content — no network calls
        ├── projects.ts
        └── skills.ts

public/                        # Static assets
├── fonts/                     # Cal Sans (see Assets below)
├── videos/                    # ink-swirl.mp4/.webm (DEPLOY. footer)
└── noise.png                  # Film grain overlay
```

## Design tokens

| Token | Hex | Role |
|---|---|---|
| `obsidian` | `#111418` | Backgrounds |
| `satin` | `#E2E8F0` | Primary text, headings |
| `ash` | `#94A3B8` | Secondary text, borders |
| `filament` | `#FF5F1F` | **Actions only** — CTAs, active states |
| `avocatus` | `#2D3E33` | Terminal glow, grid hover states |

**Typography stack:**
- **Syne** (variable, 400–800) — brand mark, DEPLOY. word
- **Cal Sans** (600) — H1/H2 display headings
- **Geist Sans** (400/500) — body, UI
- **JetBrains Mono** (400) — data, metrics, terminal, labels

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run start
```

Requires Node 18.17+.

## Assets required

Three assets need to be added before launch:

1. **`public/fonts/CalSans-SemiBold.woff2`** — Display heading font
   Download: https://github.com/calcom/font/raw/main/CalSans-SemiBold.woff2
   Falls back to Georgia until added.

2. **`public/Rashay_Daya_CV.pdf`** — Linked by the nav and sr-only content.

3. **`public/videos/ink-swirl.mp4`** + **`ink-swirl.webm`** — Ink swirl video for the DEPLOY. mask.
   Fallback is the satin-white letterform (spec-correct default state).

## Design discipline

Hard rules enforced by the codebase:

- **Filament orange is for actions only.** Never used for headings, decoration, or accents.
- **JetBrains Mono is for data contexts only.** Not for body copy or headings.
- **One motion beat per section.** The hero sweep is the hero's beat; the terminal slide is the project's beat; the Archive has no motion.
- **One WebGL canvas.** The monolith is the single 3D element. Mobile unmounts it entirely.
- **Every metric claim is a number.** No hedging copy, no "experience with", no buzzwords.

## Deployment

Zero-config on Vercel:

```bash
npx vercel --prod
```

## Phase 2 backlog (locked until Lighthouse Mobile ≥ 90)

- `CMD + K` CLI overlay (`/help`, `cat resume.pdf`, `whoami`)
- Contact form via Route Handler + Resend
- `og-image.png` for social share
- Subset Syne and Cal Sans to < 15kb each
- Case study expansion page for one project

## License

All rights reserved.
