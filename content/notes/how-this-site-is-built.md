---
title: How this portfolio is built
summary: The stack and pipeline behind this site, not a client project.
status: Published
publishedAt: 2026-06-24
---

This site is a Next.js app deployed on Cloudflare Pages, the same release path described in the Cloudflare Pages note: production deploys from `main`, every other branch gets a preview URL. The difference here is there's no separate API service to coordinate; everything is one deployable unit.

CI runs through GitHub Actions on every push: lint, type-check, the Vitest unit suite, and the Playwright end-to-end suite, all required checks before a merge to `main` can ship. The same job-per-concern structure from the GitHub Actions note applies here; a failing type-check reads as its own line, not as noise inside a longer build step.

The open-graph image at `/opengraph-image.tsx` and the boot sequence on the homepage both pull from the live GitHub Actions API at request time rather than hardcoding a status. If the CI data is unavailable, they fail closed to a static fallback instead of showing a stale or fabricated result.

Case studies, notes, skills, and project cards are all plain TypeScript data modules (`src/lib/data/`), not a CMS. There's no database for content that changes a few times a month, and that keeps every claim on the site easy to check against the source file that produced it.
