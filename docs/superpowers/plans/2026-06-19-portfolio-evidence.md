# Portfolio Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six truthful case studies, accessible architecture diagrams, recruiter actions, Kaji Labs, current builds, experience, and real project evidence.

**Architecture:** A typed case-study registry drives static project routes, project cards, metadata, trust markers, and diagrams. Homepage sections consume focused data modules; private evidence renders as disclosure text rather than invented visuals.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, SVG, Vitest, Playwright.

## Global Constraints

- Never fabricate screenshots, repositories, client information, metrics, monitoring history, or deployment logs.
- Every case study includes Overview, Problem, My role, Stack, Architecture, Key features, Deployment, Security, Challenges, What I learned, and Links.
- Trust markers are limited to the five labels approved in the design specification.
- Architecture diagrams require title, description, text fallback, and keyboard-readable link destinations.
- Kaji Labs remains visually related but organizationally distinct from client work.

---

### Task 1: Create typed portfolio content registries

**Files:**
- Create: `src/lib/data/site-links.ts`
- Create: `src/lib/data/case-studies.ts`
- Create: `src/lib/data/current-builds.ts`
- Create: `src/lib/data/experience.ts`
- Modify: `src/lib/data/projects.ts`
- Create: `src/lib/data/case-studies.test.ts`

**Interfaces:**
- Produces: `CaseStudy`, `CaseStudySection`, `ArchitectureNode`, `ArchitectureEdge`, `EvidenceItem`, and `TrustMarker` types.
- Produces: `caseStudies`, `getCaseStudy(slug)`, `caseStudySlugs`, `currentBuilds`, `experienceEntries`, and `siteLinks`.

- [ ] **Step 1: Write failing registry completeness tests**

Assert the six exact slugs, all eleven required sections, unique architecture node IDs, valid edge endpoints, honest trust-marker destinations, and no empty link URL.

- [ ] **Step 2: Run the test**

Run: `npm run test:run -- src/lib/data/case-studies.test.ts`

Expected: FAIL because the registry does not exist.

- [ ] **Step 3: Implement shared types and site links**

Use these interfaces:

```ts
export type TrustMarker = {
  label: 'Live production site' | 'Private client project' | 'Public repo available' | 'Case study available' | 'Architecture available'
  href?: string
}

export type EvidenceItem = {
  kind: 'screenshot' | 'pipeline' | 'deployment' | 'monitoring' | 'private'
  title: string
  description: string
  image?: string
  href?: string
}
```

Centralize GitHub, LinkedIn, CV, email, Kaji Labs, and live project URLs in `site-links.ts`.

- [ ] **Step 4: Add conservative case-study content**

Use existing verified stack, role, and deployment details. For unavailable proof, add `{ kind: 'private', title: 'Private implementation evidence', description: 'Additional deployment evidence is available on request.' }`. Do not invent public repositories for client projects.

- [ ] **Step 5: Add exact current-build and experience data**

Current builds:

```ts
[
  { title: 'Golden Security Scan', description: 'Reusable GitHub Action for frontend, backend, IaC, and container scanning.' },
  { title: 'Monitoring Dashboard', description: 'Grafana-based uptime and SLA dashboard for websites.' },
  { title: 'Ownique Growth OS', description: 'Lead generation and pitch deck automation system for marketing workflows.' }
]
```

Experience entries describe current engineering focus, client production platforms, infrastructure automation, and shipped technologies without inventing employment dates.

- [ ] **Step 6: Verify and commit**

Run: `npm run test:run -- src/lib/data/case-studies.test.ts`

```bash
git add src/lib/data
git commit -m "feat: add typed portfolio evidence registry"
```

### Task 2: Build accessible architecture diagrams

**Files:**
- Create: `src/components/projects/ArchitectureDiagram.tsx`
- Create: `src/components/projects/ArchitectureDiagram.test.tsx`

**Interfaces:**
- Consumes: `nodes: ArchitectureNode[]`, `edges: ArchitectureEdge[]`, `title: string`, `description: string`.
- Produces: responsive SVG plus an ordered textual flow.

- [ ] **Step 1: Write failing accessibility tests**

Assert an SVG title and description, no orphan edge IDs, and a visible text fallback listing every node.

- [ ] **Step 2: Run the test**

Run: `npm run test:run -- src/components/projects/ArchitectureDiagram.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the diagram**

Use deterministic row/column coordinates from registry data, solid token colors, arrow markers, and no hand-drawn effects. Keep node labels below 32 characters and include an adjacent `<ol>` explaining the flow.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/components/projects/ArchitectureDiagram.test.tsx`

```bash
git add src/components/projects
git commit -m "feat: add accessible project architecture diagrams"
```

### Task 3: Build static case-study routes

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `src/app/projects/[slug]/not-found.tsx`
- Create: `src/components/projects/CaseStudyHeader.tsx`
- Create: `src/components/projects/CaseStudySection.tsx`
- Create: `src/components/projects/EvidenceGallery.tsx`
- Create: `src/app/projects/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `getCaseStudy(slug)` and `caseStudySlugs`.
- Produces: `generateStaticParams()` and per-project `generateMetadata()`.

- [ ] **Step 1: Write failing route tests**

Test all static params, one public project, one private project, all required headings, canonical metadata, and the invalid-slug not-found path.

- [ ] **Step 2: Run route tests**

Run: `npm run test:run -- "src/app/projects/[slug]/page.test.tsx"`

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement the case-study composition**

Render plain-language breadcrumb navigation, project status and role, architecture, required sections, evidence, and truthful links. Private evidence must never create an empty image frame.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- "src/app/projects/[slug]/page.test.tsx" && npm run build`

```bash
git add src/app/projects src/components/projects
git commit -m "feat: publish engineering case studies"
```

### Task 4: Connect project cards to proof

**Files:**
- Modify: `src/components/ui/ProjectCard.tsx`
- Modify: `src/components/sections/ForgeProjects.tsx`
- Modify: `src/lib/data/projects.ts`
- Create: `src/components/ui/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: project `slug`, `trustMarkers`, and verified URLs.
- Produces: direct internal Case Study and Architecture links.

- [ ] **Step 1: Write failing action tests**

Assert that every project card links to its case study, private markers are non-interactive, public links open safely, and no inactive element looks like a button.

- [ ] **Step 2: Run the test**

Run: `npm run test:run -- src/components/ui/ProjectCard.test.tsx`

- [ ] **Step 3: Implement project proof actions**

Make the title and Case Study action internal links. Keep Live Site and public repository links external. Render private markers as muted text with no hover action.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/components/ui/ProjectCard.test.tsx`

```bash
git add src/components/ui/ProjectCard.tsx src/components/sections/ForgeProjects.tsx src/lib/data/projects.ts src/components/ui/ProjectCard.test.tsx
git commit -m "feat: connect project cards to evidence"
```

### Task 5: Add recruiter action cluster and homepage sections

**Files:**
- Modify: `src/components/sections/ZenithHero.tsx`
- Modify: `src/components/sections/ZenithHero.test.tsx`
- Create: `src/components/sections/KajiLabs.tsx`
- Create: `src/components/sections/CurrentlyBuilding.tsx`
- Create: `src/components/sections/ExperienceTimeline.tsx`
- Create: `src/components/sections/portfolio-sections.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/nav/SatinCommandNav.tsx`

**Interfaces:**
- Consumes: `siteLinks`, `currentBuilds`, and `experienceEntries`.
- Produces: homepage order `Hero -> Skills -> Capabilities -> Kaji Labs -> Projects -> Currently Building -> Experience -> Proof -> Contact`.

- [ ] **Step 1: Write failing homepage tests**

Assert the hero exposes Download CV, GitHub, LinkedIn, and `CV updated: June 2026`; assert all three new sections and exact current-build copy.

- [ ] **Step 2: Run the tests**

Run: `npm run test:run -- src/components/sections/ZenithHero.test.tsx src/components/sections/portfolio-sections.test.tsx`

- [ ] **Step 3: Implement the sections**

Use an asymmetric list for current builds, a chronological `<ol>` for experience, and a compact Kaji Labs strip with a single repository action. Avoid three identical card grids.

- [ ] **Step 4: Verify and commit**

Run: `npm run lint && npm run test:run && npm run build`

```bash
git add src/app/page.tsx src/components src/lib/data
git commit -m "feat: add recruiter proof and current engineering work"
```

### Task 6: Add route-level E2E verification

**Files:**
- Create: `e2e/case-studies.spec.ts`
- Modify: `e2e/navigation.spec.ts`

- [ ] **Step 1: Add browser checks**

Visit all six routes, verify eleven required headings, test hero CV/GitHub/LinkedIn links, and confirm private evidence has no broken image.

- [ ] **Step 2: Run E2E and commit**

Run: `npm run test:e2e`

```bash
git add e2e
git commit -m "test: cover portfolio evidence routes"
```
