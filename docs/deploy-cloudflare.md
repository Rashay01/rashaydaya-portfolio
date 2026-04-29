# Deploying to Cloudflare Pages

## Overview

This site uses Next.js with an API route (contact form via Resend). Cloudflare Pages runs Next.js through `@cloudflare/next-on-pages`, which compiles everything to run on Cloudflare Workers (Edge Runtime). The Three.js scene, OG image, and contact form all work on this runtime.

---

## Step 1 — Install the adapter

```bash
npm install -D @cloudflare/next-on-pages wrangler
```

---

## Step 2 — Add edge runtime to the contact API route

Cloudflare Workers do not run Node.js. Add one line to `src/app/api/contact/route.ts`:

```ts
export const runtime = 'edge'   // ← add this at the top
```

The `resend` package is edge-compatible, so nothing else needs to change in that file.

---

## Step 3 — Create `wrangler.toml`

Create this file at the project root:

```toml
name = "rashaydaya"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

The `nodejs_compat` flag enables Node.js built-ins (crypto, buffer, etc.) that Next.js and Resend depend on.

---

## Step 4 — Add build scripts to `package.json`

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "pages:build": "npx @cloudflare/next-on-pages",
  "pages:deploy": "npm run pages:build && wrangler pages deploy",
  "pages:preview": "npm run pages:build && wrangler pages dev"
}
```

---

## Step 5 — Connect GitHub to Cloudflare Pages (dashboard method)

This is the easiest way — Cloudflare redeploys on every push automatically.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorise GitHub and select the `website` repo
3. Set these build settings:

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Build command | `npx @cloudflare/next-on-pages` |
| Build output directory | `.vercel/output/static` |
| Node.js version | `20` |

4. Under **Environment variables** → add:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | your Resend API key |

5. Click **Save and Deploy**

---

## Step 6 — Add compatibility flags in the dashboard

After the first deploy, go to **Settings** → **Functions** → **Compatibility flags** and add:

```
nodejs_compat
```

Set the compatibility date to `2024-09-23` or later. This is also in `wrangler.toml` but the dashboard setting is required for Pages deployments.

---

## Step 7 — Connect your custom domain

1. In your Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `rashaydaya.co.za`
3. Cloudflare will add a CNAME record automatically if your domain is on Cloudflare DNS
4. If not on Cloudflare DNS yet: transfer or add `rashaydaya.co.za` to Cloudflare and point the nameservers

---

## Step 8 — Submit sitemap to Google Search Console

Once the domain is live:

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → Domain → `rashaydaya.co.za`
3. Verify via Cloudflare DNS TXT record (Cloudflare makes this one click)
4. Submit sitemap: `https://rashaydaya.co.za/sitemap.xml`
5. Copy the verification token and add to `src/app/layout.tsx`:

```ts
// verification: { google: 'YOUR_TOKEN_HERE' },
```

Uncomment the line and paste your token.

---

## Local preview before deploying

```bash
npm run pages:preview
```

This builds with `next-on-pages` and runs a local Cloudflare Workers simulation. Test the contact form here before pushing.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with "nodejs_compat" error | Add the flag in the Cloudflare dashboard under Functions settings |
| Contact form returns 503 | `RESEND_API_KEY` env var not set in Cloudflare Pages environment variables |
| "Edge Runtime does not support X" | The failing file is missing `export const runtime = 'edge'` |
| Three.js scene blank on deploy | Normal — Three.js is client-only (`dynamic(..., { ssr: false })`), will work after hydration |
| Custom domain not resolving | Check CNAME in Cloudflare DNS: `rashaydaya.co.za CNAME <project>.pages.dev` |
