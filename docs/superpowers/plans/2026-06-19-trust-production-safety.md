# Trust and Production Safety Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio safe to share with recruiters by fixing production drift, the invalid font, contact-form abuse controls, security headers, readability, and misleading proof claims.

**Architecture:** Keep the current Next.js App Router structure. Add small server-only validation and rate-limit modules for the contact endpoint, centralize security headers in Next configuration, and make styling changes through existing tokens and components.

**Tech Stack:** Next.js 16, React 18, TypeScript, Tailwind CSS, Vitest, Playwright, Cloudflare Pages.

## Global Constraints

- Target WCAG 2.2 AA: normal text at least 4.5:1 and large text at least 3:1.
- Do not fabricate uptime, deployment, monitoring, repository, or client evidence.
- Use `Cloudflare R2` in full; never use standalone `R2`.
- Valid locations are `Cape Town, South Africa` and `South Africa Remote/Hybrid`.
- Keep all secrets server-only and never log contact message contents.
- Content must remain visible when JavaScript or animation initialization fails.

---

### Task 1: Lock production copy and font integrity

**Files:**
- Modify: `src/components/ui/DisplayHeading.tsx`
- Modify: `src/app/globals.css`
- Delete: `public/fonts/CalSans-SemiBold.woff2`
- Modify: `src/lib/data/portfolio-copy.test.ts`

**Interfaces:**
- Produces: `.font-calsans` backed by `var(--font-syne)` and display headings capped at `6rem`.

- [ ] **Step 1: Add failing integrity assertions**

Add tests that recursively serialize portfolio data and source copy, assert no `Johannesburg`, assert no standalone `R2`, and assert `DisplayHeading` does not contain `8.5rem`.

- [ ] **Step 2: Run the focused test**

Run: `npm run test:run -- src/lib/data/portfolio-copy.test.ts`

Expected: FAIL because the display heading still uses `8.5rem`.

- [ ] **Step 3: Remove the invalid face and cap heading scale**

Change the `xl` class to:

```ts
xl: 'text-[clamp(2.5rem,9vw,6rem)]'
```

Remove the Cal Sans `@font-face`, set `--font-calsans: var(--font-syne)`, and delete the HTML document masquerading as WOFF2.

- [ ] **Step 4: Verify tests and production build**

Run: `npm run test:run -- src/lib/data/portfolio-copy.test.ts && npm run build`

Expected: test PASS and build completes without requesting `/fonts/CalSans-SemiBold.woff2`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/DisplayHeading.tsx src/app/globals.css src/lib/data/portfolio-copy.test.ts
git rm public/fonts/CalSans-SemiBold.woff2
git commit -m "fix: restore trustworthy portfolio typography"
```

### Task 2: Add response security headers

**Files:**
- Modify: `next.config.mjs`
- Create: `src/lib/security/headers.test.ts`

**Interfaces:**
- Produces: `securityHeaders`, an exported array of `{ key: string; value: string }`.

- [ ] **Step 1: Write the failing header test**

Assert that the exported headers contain CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy.

- [ ] **Step 2: Run the test**

Run: `npm run test:run -- src/lib/security/headers.test.ts`

Expected: FAIL because `securityHeaders` does not exist.

- [ ] **Step 3: Implement the header policy**

Use this CSP baseline:

```text
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.resend.com; upgrade-insecure-requests
```

Apply the exported array to `/:path*` while preserving immutable asset caching routes.

- [ ] **Step 4: Verify**

Run: `npm run test:run -- src/lib/security/headers.test.ts && npm run build`

Expected: PASS and successful build.

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs src/lib/security/headers.test.ts
git commit -m "security: add portfolio response headers"
```

### Task 3: Harden contact validation and throttling

**Files:**
- Create: `src/lib/security/contact-validation.ts`
- Create: `src/lib/security/contact-rate-limit.ts`
- Create: `src/lib/security/contact-security.test.ts`
- Modify: `src/app/api/contact/route.ts`
- Modify: `src/components/ui/ContactDialog.tsx`
- Modify: `src/components/ui/ContactDialog.test.tsx`

**Interfaces:**
- Produces: `parseContactPayload(input: unknown): ContactPayload | ContactError`.
- Produces: `checkContactRateLimit(key: string, now?: number): { allowed: boolean; retryAfter: number }`.
- Consumes: optional hidden field `companyWebsite` as a honeypot.

- [ ] **Step 1: Write failing validation tests**

Cover malformed JSON-shaped input, name over 80 characters, email over 254 characters, message over 4000 characters, a populated honeypot, and six requests inside ten minutes.

- [ ] **Step 2: Run the tests**

Run: `npm run test:run -- src/lib/security/contact-security.test.ts`

Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Implement pure validation and fixed-window limiting**

Use constants:

```ts
export const CONTACT_LIMITS = { name: 80, email: 254, message: 4000 } as const
export const CONTACT_RATE_LIMIT = { requests: 5, windowMs: 10 * 60 * 1000 } as const
```

Key limits by `CF-Connecting-IP`, fall back to `x-forwarded-for`, and finally `unknown`. Return 429 with `Retry-After` when exceeded. Reject non-JSON and requests whose declared content length exceeds 8 KB. Require same-origin when the `Origin` header is present.

- [ ] **Step 4: Add the honeypot field without visual exposure**

Render an off-screen text input named `companyWebsite`, set `tabIndex={-1}` and `autoComplete="off"`, and submit it with the form.

- [ ] **Step 5: Verify security and UI tests**

Run: `npm run test:run -- src/lib/security/contact-security.test.ts src/components/ui/ContactDialog.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/security src/app/api/contact/route.ts src/components/ui/ContactDialog.tsx src/components/ui/ContactDialog.test.tsx
git commit -m "security: harden portfolio contact channel"
```

### Task 4: Fix readability, motion resilience, and proof honesty

**Files:**
- Modify: `src/components/ui/MonoLabel.tsx`
- Modify: `src/components/ui/ProjectCard.tsx`
- Modify: `src/components/sections/ZenithHero.tsx`
- Modify: `src/components/sections/ArchiveGrid.tsx`
- Modify: `src/components/sections/ForgeProjects.tsx`
- Modify: `src/components/sections/SignatureFooter.tsx`
- Modify: `src/lib/data/projects.ts`
- Modify: `src/lib/data/portfolio-copy.test.ts`

**Interfaces:**
- Produces: non-interactive private markers rendered as plain metadata, and all actionable project links with `min-h-[44px]`.

- [ ] **Step 1: Write failing truthfulness assertions**

Assert that no project without `caseStudyUrl` uses `Case Study Available`, and that no global hero statistic contains `99.5%` or `< 2 MIN`.

- [ ] **Step 2: Run the focused tests**

Run: `npm run test:run -- src/lib/data/portfolio-copy.test.ts`

Expected: FAIL on current project labels and hero metrics.

- [ ] **Step 3: Implement visible defaults and readable metadata**

Replace opacity-zero initial section states with visible SSR output. Apply motion from visible defaults, remove infinite pulse when reduced motion is requested, raise 8px and 9px metadata to at least 10px, and replace `text-ash/70` or lower for meaningful copy with `text-ash/80` or stronger.

- [ ] **Step 4: Make proof markers honest**

Use `Private client project` for private work. Omit case-study and architecture markers until their URLs exist. Remove unsupported hero uptime and deployment-time stats.

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run test:run && npm run build`

Expected: lint PASS, all tests PASS, build PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components src/lib/data
git commit -m "fix: make portfolio claims readable and truthful"
```

### Task 5: Repair end-to-end checks and verify production parity

**Files:**
- Modify: `e2e/navigation.spec.ts`
- Modify: `e2e/contact-form.spec.ts`
- Create: `e2e/production-metadata.spec.ts`

**Interfaces:**
- Produces: browser coverage for current CTA labels, Cape Town metadata, keyboard dialogs, and absent Johannesburg copy.

- [ ] **Step 1: Update stale selectors and add metadata assertions**

Use accessible names `Contact Me`, `Start the conversation`, and `Download CV`. Assert the page contains `Cape Town` and does not contain `Johannesburg`.

- [ ] **Step 2: Run E2E locally**

Run: `npm run test:e2e`

Expected: all Chromium tests PASS without submitting a valid contact message.

- [ ] **Step 3: Run passive production checks after deployment**

Run HEAD requests for `/`, `/api/contact`, `/Rashay_Daya_CV.pdf`, and the former font URL. Confirm security headers, HTTPS redirect, PDF MIME type, and a 404 for the removed font.

- [ ] **Step 4: Commit**

```bash
git add e2e
git commit -m "test: verify recruiter-facing production trust"
```
