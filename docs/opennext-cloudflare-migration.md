# Migration: @cloudflare/next-on-pages → @opennextjs/cloudflare

## Why

`@cloudflare/next-on-pages` is deprecated upstream. Cloudflare's recommended adapter for
Next.js is now `@opennextjs/cloudflare`. Staying on the deprecated package also pinned us
to old `wrangler`/`miniflare`/`undici` versions with unfixed `npm audit` findings (see
PR that bumped `wrangler` to 4.104.0 just before this migration).

## What changed

- **Packages:** removed `@cloudflare/next-on-pages`, added `@opennextjs/cloudflare`.
- **`wrangler.toml`:** `pages_build_output_dir` → `main = ".open-next/worker.js"` plus an
  `[assets]` block pointing at `.open-next/assets`, and a `WORKER_SELF_REFERENCE` service
  binding (lets the worker call itself for background ISR revalidation).
- **`open-next.config.ts`** (new): default config, no incremental cache override. The
  site's only `fetch`-level revalidation (`src/lib/data/live-pipeline.ts`,
  `github-activity.ts`, both 30 min) doesn't need a persistent cross-instance cache —
  worst case it refetches the GitHub API a bit more often. Upgrade to
  `r2IncrementalCache` if that ever matters.
- **`next.config.mjs`:** calls `initOpenNextCloudflareForDev()` in development so
  `next dev` gets Cloudflare bindings/runtime behavior locally.
- **Removed `export const runtime = 'edge'`** from `api/contact/route.ts`, `icon.tsx`,
  `apple-icon.tsx`, `opengraph-image.tsx` — the edge runtime isn't supported by
  `@opennextjs/cloudflare`. These now run as regular Node.js-compat routes/handlers on
  the Worker (`nodejs_compat` flag), no behavior change observed.
- **`package.json` scripts:** `pages:build`/`pages:preview`/`pages:deploy` →
  `preview`/`deploy` (`opennextjs-cloudflare build` + `preview`/`deploy`).
- **`public/_headers`** (new): explicit immutable cache header for `/_next/static/*`,
  since asset caching isn't automatic when served via the Worker's `ASSETS` binding.
- **`.gitignore`:** added `.open-next/`, `.wrangler/`, `.dev.vars`.

## Known limitation

`npx wrangler deploy --dry-run` (and `npm run deploy`/`preview`) currently fails on
**Windows** with an esbuild "Could not resolve ...resvg.wasm" error — a path-separator
bug in how `@opennextjs/cloudflare` patches `next/og`'s wasm chunk loader on Windows
(mixes `/` and `\` in the generated import string). `next build` and
`opennextjs-cloudflare build` both succeed; only the wrangler bundling step on Windows
trips on it. CI and the actual Cloudflare Pages build both run on Linux, so production
deploys are unaffected. If you need to deploy/preview from a Windows machine, do it from
WSL instead.

## Verification

- `npm run build` — passes.
- `npx opennextjs-cloudflare build` — passes, `icon`/`apple-icon`/`opengraph-image` build
  as static routes instead of edge-dynamic.
- `npm run lint` / `npm run test:run` — passes (139 tests).
