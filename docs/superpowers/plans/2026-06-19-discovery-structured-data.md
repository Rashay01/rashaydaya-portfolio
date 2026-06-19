# Discovery and Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make projects and technical writing discoverable through notes, complete metadata, truthful JSON-LD, sitemap coverage, plain navigation, and a branded not-found experience.

**Architecture:** Typed note summaries and shared schema builders feed static routes and JSON-LD scripts. Sitemap generation reads route registries, preventing route lists from drifting away from published content.

**Tech Stack:** Next.js App Router, TypeScript, React, schema.org JSON-LD, Vitest, Playwright.

## Global Constraints

- Person and WebSite schemas remain present.
- SoftwareSourceCode is generated only for a project with a verified public repository URL.
- `/notes` publishes summaries; individual note routes exist only when full article content exists.
- Metadata contains no Johannesburg references.
- Navigation uses plain primary labels with command-center terminology as secondary copy.

---

### Task 1: Extract structured-data builders

**Files:**
- Create: `src/lib/seo/structured-data.ts`
- Create: `src/lib/seo/structured-data.test.ts`
- Create: `src/components/seo/JsonLd.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `buildPersonSchema()`, `buildWebsiteSchema()`, `buildSoftwareSchemas(projects)`, and `JsonLd({ data })`.

- [ ] **Step 1: Write failing schema tests**

Assert Person location is Cape Town, WebSite URL is canonical, private repositories produce no SoftwareSourceCode, and public repository projects include `codeRepository`, `programmingLanguage`, `author`, and `url`.

- [ ] **Step 2: Run the tests**

Run: `npm run test:run -- src/lib/seo/structured-data.test.ts`

Expected: FAIL because schema builders do not exist.

- [ ] **Step 3: Implement typed schema builders**

Move inline objects from `layout.tsx` into pure functions. Escape JSON-LD `<` characters in `JsonLd` before assigning `dangerouslySetInnerHTML`.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/lib/seo/structured-data.test.ts && npm run build`

```bash
git add src/lib/seo src/components/seo src/app/layout.tsx
git commit -m "feat: add truthful portfolio structured data"
```

### Task 2: Add notes registry and index route

**Files:**
- Create: `src/lib/data/notes.ts`
- Create: `src/lib/data/notes.test.ts`
- Create: `src/app/notes/page.tsx`
- Create: `src/components/notes/NoteIndex.tsx`

**Interfaces:**
- Produces: `NoteSummary` and `noteSummaries`.

- [ ] **Step 1: Write failing note tests**

Assert these five exact titles, unique slugs, descriptions between 40 and 180 characters, and `status: 'planned'`:

```text
How I deploy React apps with Cloudflare Pages
How I structure GitHub Actions for CI/CD
How I use Terraform for reusable infrastructure
How I built a production RSVP platform
How I monitor websites with Grafana
```

- [ ] **Step 2: Run the tests**

Run: `npm run test:run -- src/lib/data/notes.test.ts`

- [ ] **Step 3: Implement `/notes`**

Render a semantic article list with topic, summary, and `Planned` status. Do not render links to nonexistent articles. Add page metadata and canonical URL.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/lib/data/notes.test.ts && npm run build`

```bash
git add src/lib/data/notes.ts src/lib/data/notes.test.ts src/app/notes src/components/notes
git commit -m "feat: add technical notes index"
```

### Task 3: Generate complete sitemap coverage

**Files:**
- Modify: `src/app/sitemap.ts`
- Create: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `caseStudySlugs` and published notes.
- Produces: homepage, notes index, six case-study URLs, and only published article URLs.

- [ ] **Step 1: Write failing sitemap test**

Assert eight current URLs: homepage, notes index, and six project routes. Assert no planned note slug appears as a URL.

- [ ] **Step 2: Run the test**

Run: `npm run test:run -- src/app/sitemap.test.ts`

- [ ] **Step 3: Implement registry-driven sitemap**

Use stable `lastModified` values from content data rather than `new Date()` on every request.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/app/sitemap.test.ts && npm run build`

```bash
git add src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat: include portfolio routes in sitemap"
```

### Task 4: Clarify global navigation

**Files:**
- Modify: `src/components/nav/SatinCommandNav.tsx`
- Modify: `src/components/nav/SatinCommandNav.test.tsx`
- Modify: `src/components/sections/SignatureFooter.tsx`

**Interfaces:**
- Produces: primary labels `Skills`, `Projects`, `Experience`, `Notes`, and `Contact`.

- [ ] **Step 1: Write failing navigation tests**

Assert all five labels, `/notes`, CV access, and mobile keyboard closure. Assert Archive, Forge, and Deploy are not the sole accessible names.

- [ ] **Step 2: Run tests**

Run: `npm run test:run -- src/components/nav/SatinCommandNav.test.tsx`

- [ ] **Step 3: Implement clear labels**

Keep Archive, Forge, and Deploy only as short secondary mono labels where space permits. Use plain labels for link accessible names and visible primary text.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/components/nav/SatinCommandNav.test.tsx`

```bash
git add src/components/nav/SatinCommandNav.tsx src/components/nav/SatinCommandNav.test.tsx src/components/sections/SignatureFooter.tsx
git commit -m "feat: clarify portfolio navigation"
```

### Task 5: Add a branded not-found route

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/not-found.test.tsx`

- [ ] **Step 1: Write failing not-found test**

Assert one `h1`, a Home link, a Projects link, no framework-default copy, and full keyboard accessibility.

- [ ] **Step 2: Run the test**

Run: `npm run test:run -- src/app/not-found.test.tsx`

- [ ] **Step 3: Implement the route**

Use existing typography and tokens with copy: `Route unavailable.` and `The requested system path does not exist.` Avoid decorative cards and fake terminal errors.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/app/not-found.test.tsx && npm run build`

```bash
git add src/app/not-found.tsx src/app/not-found.test.tsx
git commit -m "feat: add portfolio not-found experience"
```

### Task 6: Verify discovery in the browser and production HTML

**Files:**
- Create: `e2e/discovery.spec.ts`

- [ ] **Step 1: Add browser assertions**

Verify `/notes`, all project canonical links, not-found navigation, sitemap URLs, Person and WebSite JSON-LD, and SoftwareSourceCode only when a public repo exists.

- [ ] **Step 2: Run full verification**

Run: `npm run lint && npm run test:run && npm run build && npm run test:e2e && npm audit --audit-level=high`

Expected: every command exits 0.

- [ ] **Step 3: Commit**

```bash
git add e2e/discovery.spec.ts
git commit -m "test: verify portfolio discovery surfaces"
```
