# Hero LCP Fix — CLI Stagger Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `NO_LCP` and 3.3s desktop FCP by rendering the hero heading immediately and staggering in secondary elements like CLI terminal output.

**Architecture:** Pull the `<h1>`, role label, and top label out of the `opacity: 0` motion wrapper so they're visible from SSR first paint. After the 1200ms sweep, stagger in paragraph, buttons, stats, geo text, and monolith with 120ms spacing. Add a Cal Sans font preload to eliminate FOUT.

**Tech Stack:** Next.js 16 App Router, Framer Motion, Tailwind CSS, TypeScript

---

### Task 1: Add Cal Sans font preload to layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the preload link inside `<head>`**

Open `src/app/layout.tsx`. The `<head>` block currently contains two `<script>` tags for JSON-LD. Add the preload link as the FIRST child of `<head>`:

```tsx
<head>
  <link
    rel="preload"
    href="/fonts/CalSans-SemiBold.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
  />
</head>
```

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: build completes with no errors. The preload link has no runtime effect locally — its benefit is at the CDN edge.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: preload Cal Sans font to eliminate FOUT on desktop"
```

---

### Task 2: Restructure ZenithHero animations — render heading immediately

**Files:**
- Modify: `src/components/sections/ZenithHero.tsx`

**Goal of this task:** The `<h1>` "Rashay / Daya", the `DEVOPS ENGINEER & FULL STACK BUILDER` MonoLabel, and the top `ENGINEERING SYSTEM PORTFOLIO 01` label must be in the DOM at full opacity from SSR — no animation wrapper around them.

- [ ] **Step 1: Replace the single motion wrapper with per-element motion divs**

Replace the entire `ZenithHero` return statement with the version below. Key changes:
- Top label, h1, and role label are **outside** any `opacity: 0` wrapper
- A helper `staggerProps` function builds per-index motion props
- Paragraph, buttons, stats, geo text, and monolith each get their own `motion.div` that only animates after `swept`

```tsx
export function ZenithHero() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  const isXLScreen = useMediaQuery('(min-width: 1440px)')
  const [swept, setSwept] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()

  useEffect(() => {
    const t = setTimeout(() => setSwept(true), prefersReducedMotion ? 0 : 1200)
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  // Builds stagger animation props for each secondary element
  function staggerProps(index: number) {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: swept ? 1 : 0 },
        animate: { opacity: swept ? 1 : 0 },
        transition: { duration: 0 },
      }
    }
    return {
      initial: { opacity: 0, y: 6 },
      animate: swept ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
      transition: { duration: 0.35, ease: 'easeOut', delay: index * 0.12 },
    }
  }

  return (
    <section
      id="zenith"
      className="relative min-h-screen bg-obsidian overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* SR-only shadow content for WebGL blindspot + SEO */}
      <div className="sr-only">
        <p>
          Rashay Daya — DevOps Engineer &amp; Full Stack Builder.
          Building production systems from infrastructure to interface.
          System reliability high. Uptime 99.5%. Deployment time under 2 minutes.
        </p>
      </div>

      {!swept && <div className="sweep-line" aria-hidden="true" />}

      <div className="relative z-10 px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24">
        {/* Top label — visible immediately (LCP anchor) */}
        <MonoLabel size="xs" className="mb-8 sm:mb-10 md:mb-14 block">
          ENGINEERING SYSTEM PORTFOLIO 01
        </MonoLabel>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-6 lg:gap-10 items-start">

          {/* Left column */}
          <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4 md:gap-4">
            {/* h1 — visible immediately, this is the LCP element */}
            <DisplayHeading as="h1" size="xl" id="hero-heading">
              Rashay
              <br />
              Daya
            </DisplayHeading>

            {/* Role label — visible immediately */}
            <MonoLabel size="sm" className="block tracking-[0.12em]">
              DEVOPS ENGINEER &amp; FULL STACK BUILDER
            </MonoLabel>

            {/* Monolith — stagger index 4 */}
            <motion.div {...staggerProps(4)}>
              {isDesktop === null ? (
                <div
                  style={{ marginTop: '-5rem', width: '360px', height: '400px' }}
                  aria-hidden="true"
                />
              ) : isDesktop ? (
                <div
                  className="relative"
                  style={
                    isXLScreen
                      ? { marginTop: '-4rem', width: '440px', height: '480px' }
                      : isLargeScreen
                      ? { marginTop: '-5rem', width: '360px', height: '400px' }
                      : { marginTop: '-4rem', width: 'clamp(220px, 40%, 320px)', height: 'clamp(220px, 32vh, 340px)' }
                  }
                  aria-hidden="true"
                >
                  <MonolithScene />
                </div>
              ) : (
                <div
                  className="border border-avocatus/25 bg-avocatus/5 p-5 sm:p-6 rounded-sm mt-2 relative overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 100%, rgba(90,138,110,0.25), transparent 70%)',
                    }}
                  />
                  <div className="relative font-mono text-[10px] text-ash leading-[1.8] tracking-[0.08em] uppercase">
                    RASHAY DAYA / PORTFOLIO v1.0
                    <br />
                    <span className="text-ash/60">LOCATION — JOHANNESBURG, ZA</span>
                    <br />
                    <span className="text-ash/60">COORD — 26.2041° S / 28.0473° E</span>
                    <br />
                    <span className="text-live">STATUS — LIVE</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="md:col-span-5 flex flex-col gap-8 sm:gap-10 md:gap-12 md:pt-2">

            {/* Paragraph — stagger index 0 */}
            <motion.p
              {...staggerProps(0)}
              className="text-ash text-[15px] sm:text-base leading-[1.6] tracking-[-0.01em] max-w-[340px]"
            >
              I build and operate production systems.
              Infrastructure, APIs, and full-stack applications designed to scale.
            </motion.p>

            {/* CTA buttons — stagger index 1 */}
            <motion.div {...staggerProps(1)} className="flex flex-col xs:flex-row flex-wrap gap-3">
              <FilamentButton href="#forge">
                VIEW PROJECTS →
              </FilamentButton>
              <FilamentButton as="button" onClick={openContact}>
                GET IN TOUCH →
              </FilamentButton>
            </motion.div>

            {/* Stats — stagger index 2 */}
            <motion.dl
              {...staggerProps(2)}
              className="pt-6 sm:pt-8 border-t border-ash/10"
              aria-label="Live system stats"
            >
              {systemStats.map((stat) => (
                <div
                  key={stat.key}
                  className="flex items-baseline justify-between py-2.5 border-b border-ash/[0.08] last:border-b-0"
                >
                  <dt className="font-mono text-[10px] text-ash/80 uppercase tracking-[0.08em]">
                    {stat.key}
                  </dt>
                  <dd className="font-mono text-[13px] text-satin tracking-[-0.01em]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            {/* Geo text — stagger index 3 */}
            <motion.div {...staggerProps(3)} className="hidden md:block">
              <p className="font-mono text-[10px] text-ash/70 leading-[1.8] uppercase tracking-[0.08em]">
                LOCATION — JOHANNESBURG, ZA
                <br />
                COORD — 26.2041° S / 28.0473° E
                <br />
                SYSTEM — RASHAY DAYA PORTFOLIO v1.0
                <br />
                <span className="text-live/70">STATUS — LIVE</span>
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Check TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds with no type errors. If `DisplayHeading` doesn't accept an `id` prop, remove the `id="hero-heading"` from `DisplayHeading` and add a wrapper `<span id="hero-heading" className="sr-only">Rashay Daya</span>` immediately before it instead. The `aria-labelledby="hero-heading"` on the `<section>` tag also changed from `hero-heading-sr` — update `aria-labelledby` to match whichever id you use.

- [ ] **Step 3: Verify visually in dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- "Rashay / Daya" heading and role label are visible immediately on page load (no flash of invisible text)
- After ~1.2s the paragraph, buttons, stats, and geo text fade + slide up sequentially
- The sweep line animation still plays
- The Three.js monolith fades in last
- On mobile: the typographic monolith block fades in correctly

- [ ] **Step 4: Check reduced-motion**

In Chrome DevTools → Rendering → Emulate CSS media: `prefers-reduced-motion: reduce`. Reload. All elements should be visible immediately — no animation delays.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ZenithHero.tsx
git commit -m "perf: fix NO_LCP — render h1 immediately, stagger secondary elements as CLI output"
```

---

### Task 3: Verify DisplayHeading accepts id prop (conditional)

**Files:**
- Read: `src/components/ui/DisplayHeading.tsx`

Only do this task if the build in Task 2 Step 2 errored on the `id` prop.

- [ ] **Step 1: Check DisplayHeading's prop interface**

Read `src/components/ui/DisplayHeading.tsx`. If the component spreads `...rest` onto the heading element, `id` already works — skip this task. If it has a strict props interface without `id`, add it:

```tsx
// Find the props type, e.g.:
type DisplayHeadingProps = {
  as?: 'h1' | 'h2' | 'h3'
  size?: 'xl' | 'lg' | 'md'
  className?: string
  children: React.ReactNode
  id?: string          // add this line
}
```

- [ ] **Step 2: Re-run build and confirm clean**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit if changed**

```bash
git add src/components/ui/DisplayHeading.tsx
git commit -m "fix: add id prop to DisplayHeading for LCP anchor"
```
