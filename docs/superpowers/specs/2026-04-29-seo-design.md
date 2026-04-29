# SEO Design — rashaydaya.co.za

> Date: 2026-04-29  
> Stack: Next.js 14 App Router · Tailwind CSS · Framer Motion

---

## Goal

Ensure `rashaydaya.co.za` appears at the top of Google for branded searches like  
"Rashay Daya", "rashaydaya.co.za", "Rashay Daya DevOps", "Rashay Daya portfolio".

---

## Current State

| Signal | Status |
|--------|--------|
| `<title>` + `<meta description>` | ✅ Present |
| Open Graph / Twitter card | ✅ Present |
| JSON-LD Person schema | ✅ Present |
| `robots` directive | ✅ Present |
| **Domain** (`metadataBase`) | ❌ Wrong — set to `rashaydaya.dev` |
| `sitemap.xml` | ❌ Missing |
| `robots.txt` | ❌ Missing |
| OG image (`/og-image.png`) | ❌ Referenced but file absent |
| Canonical URL tag | ❌ Missing |
| Google Search Console | ❌ Not set up |

---

## Implementation Plan

### 1 — Fix domain throughout `layout.tsx`

Change every occurrence of `rashaydaya.dev` → `rashaydaya.co.za`:

```ts
// src/app/layout.tsx
metadataBase: new URL('https://rashaydaya.co.za'),

openGraph: {
  url: 'https://rashaydaya.co.za',
  ...
},

// jsonLd
url: 'https://rashaydaya.co.za',
```

---

### 2 — Add canonical URL to metadata

```ts
// src/app/layout.tsx — inside the metadata object
alternates: {
  canonical: 'https://rashaydaya.co.za',
},
```

---

### 3 — Add `sitemap.ts`

Creates `/sitemap.xml` automatically at build time.

```ts
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rashaydaya.co.za',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

---

### 4 — Add `robots.ts`

Creates `/robots.txt` automatically at build time.

```ts
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://rashaydaya.co.za/sitemap.xml',
    host: 'https://rashaydaya.co.za',
  }
}
```

---

### 5 — Create OG image

Two options — pick one:

**Option A (recommended): Static PNG**  
Create a 1200×630px image and save as `public/og-image.png`.  
Tools: Figma, Canva, or any image editor.  
Content: name "Rashay Daya", title "DevOps & Full Stack Developer", dark background matching `#111418`.

**Option B: Dynamic via Next.js ImageResponse**  
```ts
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#111418',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
      }}
    >
      <div style={{ color: '#FF5F1F', fontSize: 24, fontFamily: 'monospace', marginBottom: 16 }}>
        rashaydaya.co.za
      </div>
      <div style={{ color: '#E2E8F0', fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
        Rashay Daya
      </div>
      <div style={{ color: '#94A3B8', fontSize: 28, marginTop: 16 }}>
        DevOps & Full Stack Developer
      </div>
    </div>
  )
}
```

When using Option B, remove the `images` array from the `openGraph` and `twitter` metadata blocks  
— Next.js wires it automatically.

---

### 6 — Google Search Console (manual step)

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → **URL prefix** → `https://rashaydaya.co.za`
3. Choose **HTML tag** verification → copy the `content` value from the meta tag shown
4. Add to `layout.tsx` metadata:

```ts
verification: {
  google: 'PASTE_YOUR_TOKEN_HERE',
},
```

5. Back in Search Console → click **Verify**
6. Go to **Sitemaps** → submit `https://rashaydaya.co.za/sitemap.xml`

This tells Google to crawl immediately instead of waiting weeks.

---

### 7 — Improve JSON-LD: add WebSite schema

Add a second JSON-LD block alongside the existing Person block to help Google understand the site itself:

```ts
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rashay Daya — Technical Vanguard',
  url: 'https://rashaydaya.co.za',
  author: {
    '@type': 'Person',
    name: 'Rashay Daya',
  },
}
```

Render it as a second `<script type="application/ld+json">` in `<head>`.

---

## Priority Order

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Fix domain in `layout.tsx` | 5 min | High — wrong domain breaks all OG/canonical signals |
| 2 | Add canonical URL | 2 min | High — prevents duplicate-URL penalties |
| 3 | Add `sitemap.ts` | 5 min | High — Google can't find pages without it |
| 4 | Add `robots.ts` | 5 min | Medium — tells crawlers where to go |
| 5 | Create OG image | 20 min | Medium — required for good social previews |
| 6 | Google Search Console | 10 min | High — without this, indexing can take weeks |
| 7 | Add WebSite JSON-LD | 5 min | Low — incremental structured-data signal |

---

## After Implementation

Run these checks before submitting to Search Console:

- [ ] `https://rashaydaya.co.za/sitemap.xml` returns valid XML
- [ ] `https://rashaydaya.co.za/robots.txt` mentions the sitemap URL
- [ ] View source → `<title>` contains "Rashay Daya"
- [ ] Paste URL into [opengraph.xyz](https://www.opengraph.xyz) to preview OG image
- [ ] [search.google.com/test/rich-results](https://search.google.com/test/rich-results) — paste URL to validate JSON-LD
