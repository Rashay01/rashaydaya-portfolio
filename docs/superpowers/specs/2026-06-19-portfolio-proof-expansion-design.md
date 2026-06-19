# Portfolio Proof Expansion Design

## Objective

Turn Rashay Daya's portfolio into a credible production-engineering command center for junior DevOps, cloud, platform, and full-stack hiring. Preserve the existing dark technical identity while making every important claim inspectable and every hiring action obvious.

## Scope

The approved work is divided into three independently releasable patches:

1. Trust and production safety.
2. Portfolio evidence and case studies.
3. Discovery, notes, and structured data.

Application changes must not fabricate screenshots, repository access, uptime, deployment statistics, or client details. Private work is labelled explicitly.

## Patch 1: Trust and Production Safety

- Replace the invalid Cal Sans asset with a genuine WOFF2 file or remove the face until a valid asset exists.
- Add CSP, HSTS, frame protection, Permissions Policy, Referrer Policy, and content-type protection in `next.config.mjs`.
- Add contact request size limits, field length limits, same-origin enforcement, rate limiting, and a honeypot field without exposing the Resend key.
- Keep contact responses generic and avoid logging message contents.
- Raise normal text contrast to at least 4.5:1 and large text to at least 3:1.
- Raise project actions to a 44px touch target and avoid unreadable 8px metadata.
- Keep content visible without JavaScript; motion enhances an already-visible render.
- Remove misleading case-study labels and unsupported global metrics until evidence is linked.
- Verify that all visible and metadata locations say Cape Town, South Africa or South Africa Remote/Hybrid.

## Patch 2: Portfolio Evidence

Create these routes from one typed case-study data source:

- `/projects/house-of-chai`
- `/projects/event-rsvp-platform`
- `/projects/infrastructure-blueprint-system`
- `/projects/cicd-pipeline-system`
- `/projects/security-scan-action`
- `/projects/monitoring-dashboard`

Each case study contains Overview, Problem, My role, Stack, Architecture, Key features, Deployment, Security, Challenges, What I learned, and Links. Architecture is represented as accessible HTML and SVG with a textual fallback. Screenshots use real local assets or verified public-site captures; unavailable private evidence is labelled `Available on request`.

Project trust markers are limited to `Live production site`, `Private client project`, `Public repo available`, `Case study available`, and `Architecture available`. A marker is a link only when its destination exists.

The homepage gains:

- A hero action cluster containing Download CV, GitHub, LinkedIn, and `CV updated: June 2026`.
- Currently Building with Golden Security Scan, Monitoring Dashboard, and Ownique Growth OS.
- A chronological experience timeline covering current focus, projects, client work, technologies, and shipped outcomes.
- A compact Kaji Labs section after System Capabilities and before Projects, positioned as Rashay's tooling and automation lab.
- Evidence previews using project screenshots, deployment proof, pipeline proof, and monitoring proof where real assets exist.

## Patch 3: Discovery

- Add `/notes` with the five approved starter topics as summaries. Individual article routes are added only when article content exists.
- Expand the sitemap with project and notes routes.
- Keep Person and WebSite JSON-LD and generate SoftwareSourceCode only for public repositories.
- Add per-case-study metadata, canonical URLs, Open Graph data, and breadcrumb structure.
- Add a branded not-found page and plain-language navigation labels while retaining command-center terminology as secondary copy.

## Data Architecture

`src/lib/data/projects.ts` becomes the source for project summaries and links. Detailed content moves to `src/lib/data/case-studies.ts`. Supporting modules hold experience, current builds, notes, and site links. Components consume typed data and do not duplicate content strings.

## Accessibility and Interaction

- Target WCAG 2.2 AA.
- Preserve skip navigation, semantic landmarks, heading order, dialog focus traps, focus restoration, and reduced motion.
- SVG diagrams include titles, descriptions, and adjacent text explanations.
- All external links indicate their destination and use `noopener noreferrer` when opening a new tab.
- No content depends on hover to be discoverable.

## Verification

- Unit tests validate data completeness, trust-marker truthfulness, route generation, metadata, JSON-LD, contact validation, and exact location wording.
- Playwright covers primary navigation, CV access, project routes, keyboard dialogs, and notes navigation.
- Production verification runs lint, unit tests, build, E2E tests, dependency audit, passive header checks, broken-link checks, and live metadata checks.
- Deployment is not considered complete until the public site matches the repository and no Johannesburg references remain.

## Out of Scope

- Fabricated private repositories, client analytics, monitoring history, deployment logs, or screenshots.
- Authentication, a CMS, comments, newsletter infrastructure, or a new backend database.
- Replacing the established palette or redesigning the portfolio into a generic developer template.
