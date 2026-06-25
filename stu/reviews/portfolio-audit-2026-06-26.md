# Portfolio Audit — 2026-06-26

Three lenses: recruiter/viewer, code quality (ponytail), and suggestions to stand out.

---

## 1. Recruiter / General Viewer

**Overall rating: 8 / 10**

### What lands well

- Design is immediately distinctive. Dark, engineering-focused, zero template energy.
- The terminal hover panels on ProjectCards are impressive and memorable.
- "CV UPDATED: APRIL 2026" timestamp is a credibility signal no other portfolio has.
- Tech filter pills on /projects let a recruiter drill to a specific stack instantly.
- Infrastructure Blueprint System case study is the strongest piece -- "50 units, weeks to a parameterised call" is exactly the number-backed claim that sticks.
- Notes page signals depth beyond just shipping code.
- The mac-chrome terminal aesthetic is consistent and intentional throughout.

### Issues (fix these)

| # | Issue | Impact |
|---|-------|--------|
| 1 | "ENGINEERING SYSTEM PORTFOLIO 01" -- the "01" is unexplained. Reads like there is a "02" coming. Drop the number. | Medium |
| 2 | No seniority signal anywhere. "Junior" appears in the /now page experience block but not on the hero. Recruiter scanning for a senior hire will bounce without reading that far. | High |
| 3 | Three WIP case studies with placeholder images (security-scan, monitoring, cicd-pipeline has placeholder evidence). Placeholders signal incompleteness. Either ship real content or hide them until ready. | Medium |
| 4 | Contact is a full-screen takeover only. Some hiring managers just want an email to copy. Put the address in the footer. | Low |
| 5 | CV UPDATED date will keep aging. April 2026 is now 2 months old. Auto-update it or remove the month precision. | Low |

---

## 2. Ponytail (Code Quality)

**Overall rating: 7 / 10** (was 6/10 before this session's cuts)

### Cuts made this session

- `PrintButton.tsx` -- 11 lines, 0 callers. Deleted.
- `githubUrl` and `codeLabel` fields on `ProjectData` -- 0 of 4 projects used them. Deleted.
- Duplicate `REPO` constant in `github-activity.ts` and `live-pipeline.ts` -- now a single export.
- `TerminalLine` export -- internal-only, unexported.
- `Experiments` and `Research` from `KajiLabsCategory` union -- no builds in those categories.
- 14 temp audit screenshots from `public/evidence`.

### Still to cut (low priority)

| Finding | Tag | Effort |
|---------|-----|--------|
| `MonoLabel` `as` prop -- never passed, always renders `<span>` | yagni | 10 min |
| `SectionHeader` `headingAs` prop -- all 4 callers use default `h2` | yagni | 10 min |
| `DisplayHeading` `className` prop -- never passed | yagni | 5 min |
| `Metric` `size='sm'` -- defined, never used at any call site | yagni | 5 min |
| `cv-meta.ts` -- 8-line file, 1 function, 1 caller. Inline into page.tsx | yagni | 10 min |
| `BorderBeam` -- 8 customisable props, all at defaults at its one call site. Hard-code. | shrink | 15 min |
| `gsap` dep -- used in ZenithHero only for one ScrollTrigger. Replace with framer-motion useScroll | delete | 1 hr |
| mac dots repeated in 3 files (TerminalPanel, ContactDialog, CommandPalette) -- extract a `<MacDots />` component | shrink | 15 min |
| `SatinCommandNav` duplicates focus-trap + scroll-lock from `useDialogBehavior` | native | 30 min |

---

## 3. Suggestions to Stand Out

### High value / quick

1. **Add years of experience to the hero.** One line: "3 years building production systems" tells a recruiter instantly where you sit on the seniority ladder. Currently missing.
2. **Ship a real evidence image for the CI/CD pipeline case study.** It is one of the most technically interesting projects but currently has a placeholder. A screenshot of a real passing workflow run would close the loop.
3. **Email in footer.** `rashay.jcdaya@gmail.com` visible without needing to open the contact dialog. Reduces friction for passive interest.
4. **Add a "Currently open to" badge on the hero.** A small pill: "Open to DevOps, Platform, Full-Stack roles" makes you immediately actionable to a recruiter without them reading three pages.

### Medium value / more work

5. **Case study for Kaji Guard once shipped.** The private repo + WIP placeholder is fine short-term. When it ships, a case study with before/after security scan output would be extremely compelling.
6. **Systems Map view on /projects.** The toggle exists but if the map is thin, it dilutes the projects page. Either fill it with real architecture or remove the toggle.
7. **Add a "View all notes" teaser to the home page.** Notes are hidden behind the nav. A 2-3 line preview of the most recent note on the home page would show writing chops without the recruiter needing to discover the Notes page.
8. **Add a LinkedIn OG image.** When you share the URL on LinkedIn it currently shows the default OG image. The `opengraph-image.tsx` with live CI data is great but verify it renders correctly on LinkedIn's fetcher.

### Longer term

9. **Kaji Labs section expansion.** Two builds is thin. One more released tool (even a small one) would fill the section and reinforce the "builder not just implementer" narrative.
10. **Case studies for monitoring-platform and security-scan-action.** Both are technically rich work that recruiters hiring for DevOps/Platform roles specifically look for. Prioritise writing these over any new UI work.

---

## SEO spot-check

- Metadata titles and descriptions are present and correct on all pages.
- `robots.ts` blocks AI crawlers, allows search engines. Correct.
- `sitemap.ts` generates dynamically from data. Correct.
- OG image wired up with live CI data. Distinctive.
- One concern: case study pages that are `status: 'Private'` still render full content publicly. If they ever contain truly private info, consider a `noindex` meta tag.

---

## Bug check

- `status: 'Case study'` producing "CASE STUDY / CASE STUDY" eyebrow -- **fixed this session**.
- `PrintButton` was exported but had 0 callers -- **fixed this session**.
- `githubUrl` dead branch in ProjectCard was unreachable code -- **fixed this session**.
- No TypeScript errors (lint clean, 139 unit tests passing).
- `Not implemented: navigation to another Document` in test output -- harmless jsdom warning from router navigation in tests, not a real bug.
