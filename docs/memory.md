# Architecture Decisions

Short-lived ADR log. One entry per decision that would otherwise need
re-deriving from a diff. Newest first.

## 2026-06-22 — Case studies: intercepting routes, not a client-side modal

**Decision:** `/projects/[slug]` is a real, statically-generated page (SEO,
sharing, sitemap). The homepage opens it as an overlay via Next's parallel +
intercepting routes (`src/app/@modal/(.)projects/[slug]/`), not a React-context
modal with no URL.

**Why:** A URL-less popup is invisible to search engines and can't be shared
or bookmarked — bad for a portfolio whose entire point is being discovered.
Intercepting routes give the popup UX (X to close, scroll, stay on page)
while keeping a real, crawlable URL. Direct visits/reloads render the full
page; in-app clicks render the modal. No new dependency — framework-native.

**Reversal note:** A first pass built `CaseStudyContext` + `CaseStudyDialog`
(client-side only, no URL change). Deleted in favor of the above — don't
resurrect that pattern.

## 2026-06-22 — Architecture diagrams: Mermaid, generated from existing data

**Decision:** `buildMermaidFlowchart()` (`src/lib/data/case-studies.ts`)
generates Mermaid flowchart syntax from the existing `architecture.nodes`/`edges`
structure; `MermaidDiagram` renders it client-side via the `mermaid` package.
The accessible text fallback (ordered list of nodes/edges) stays — Mermaid SVG
output is `aria-hidden`, wrapped in a `role="img"` container with `aria-labelledby`.

**Why:** Replaces a hand-rolled placeholder SVG. Didn't hand-author Mermaid
syntax per case study — generating it from the existing typed node/edge data
keeps one source of truth and avoids drift.

## 2026-06-22 — Vanguard Pipeline card: live data, not fabricated

**Decision:** The "Vanguard Pipeline" readout in the Forge section fetches the
latest completed run from this repo's real GitHub Actions workflow
(`Rashay01/rashaydaya-portfolio`, `ci.yml`) via `src/lib/data/live-pipeline.ts`,
with a 30-minute ISR revalidate and a graceful null fallback if the API is
unreachable.

**Why:** The card previously showed fabricated terminal lines ("42/42 tests
passed", a fake artifact hash) attributed to a portfolio project. An earlier
review flagged exactly this kind of unsupported metric. This repo's own CI is
real and public — showing its actual status is both true and a better trust
signal than invented numbers.

## 2026-06-22 — No co-author trailer on commits in this repo

User preference — see `[[feedback-no-coauthor-commits]]` in Claude's memory.
Lint + tests (+ security review when touching API/form/auth code) run before
every commit in this repo.
