---
title: How I deploy React apps with Cloudflare Pages
summary: A practical release path from repository to a verified production deployment.
status: Published
publishedAt: 2026-06-22
relatedCaseStudy: house-of-chai
---

Cloudflare Pages builds straight from a Git repository, so the release path starts with the branch model: production deploys come from `main`, every other branch gets its own preview URL automatically. That preview URL is the actual review artifact. I link it in the PR instead of describing the change, because a reviewer clicking a live build catches more than a diff does.

The build step itself is just the framework's normal production build (`next build` for a static export, or the equivalent for whatever the frontend is). Pages does not need anything framework-specific configured beyond the build command and output directory, so the temptation is to reach for a Cloudflare-specific adapter before checking whether the plain build output already works.

Environment variables split into two groups: build-time variables baked into the static output, and anything secret that the API layer needs, which never goes near the frontend bundle. For House of Chai, the frontend is static on Pages and the Node.js API is a separate Railway service, so keeping that boundary explicit means a frontend redeploy can never accidentally leak a backend credential.

After every deploy I check three things before calling it done: the production URL loads with a 200, the deployed commit hash in the Pages dashboard matches what I expect, and any client-facing form or fetch still hits the right API origin. That last one is the failure mode I have actually hit: a preview deploy quietly pointing at a stale API URL because an environment variable wasn't scoped to the right environment.
