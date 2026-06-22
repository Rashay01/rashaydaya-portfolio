# Cloudflare & Performance Fixes

These are the remaining PageSpeed improvements that require Cloudflare dashboard changes
or manual file operations — not code changes.

---

## 1. Fix: robots.txt "Unknown directive" (SEO 92 → 100)

**Problem:** Google Search Console and Lighthouse report:
```
Line #29 — Content-Signal: search=yes,ai-train=no — Unknown directive
```
Cloudflare's Bot Fight Mode appends this line to your deployed `robots.txt` after Next.js
generates it. Your `src/app/robots.ts` is clean — this is a Cloudflare-side injection.

**Fix:**
1. [dash.cloudflare.com](https://dash.cloudflare.com) → select **rashaydaya.co.za**
2. **Security → Bots → Configure Bot Fight Mode**
3. Turn off **"Instruct AI bot traffic with robots.txt"**
4. **Caching → Configuration → Purge Everything**

Verify by visiting `https://rashaydaya.co.za/robots.txt` directly after the next deploy.

---

## 2. Fix: email-decode.min.js render-blocking script (est. 450ms savings)

**Problem:** Cloudflare injects `cloudflare-static/email-decode.min.js` (1.2 KiB) into
every page load because it detected the `mailto:rashay.jcdaya@gmail.com` link in the
footer and obfuscated it. This script blocks page rendering.

**Fix:**
1. [dash.cloudflare.com](https://dash.cloudflare.com) → select **rashaydaya.co.za**
2. **Scrape Shield → Email Address Obfuscation**
3. Turn it **OFF**
4. **Caching → Configuration → Purge Everything**

Your email address is already public knowledge on LinkedIn and GitHub — obfuscation
provides minimal real-world spam protection and costs 450ms of render time.

---

## 3. Fix: noise.webp further compression (est. 32 KiB savings)

**Problem:** `public/noise.webp` is 42.9 KiB. Lighthouse estimates 32 KiB can be saved
with higher compression. The image is used at 3% opacity as a film grain overlay — it
does not need high fidelity.

**Fix:**
1. Go to [squoosh.app](https://squoosh.app)
2. Open `public/noise.webp`
3. Output format: **WebP**, quality: **15–20**
4. Download and replace `public/noise.webp`

At quality 20, a 256×256 WebP should be around 8–12 KiB. The grain will still look
identical at 3% opacity.

---

## AI bot blocking (already configured in code)

`src/app/robots.ts` handles AI bot policy via standard `User-agent` rules:

| Bot | Action | Reason |
|-----|--------|--------|
| `GPTBot` | Blocked | OpenAI training crawler |
| `anthropic-ai` | Blocked | Anthropic training crawler |
| `CCBot` | Blocked | Common Crawl (training datasets) |
| `Google-Extended` | Blocked | Gemini training |
| `FacebookBot` | Blocked | Meta training |
| `Applebot-Extended` | Blocked | Apple AI training |
| `cohere-ai` | Blocked | Cohere training |
| `ChatGPT-User` | Allowed | ChatGPT real-time browsing |
| `Claude-Web` | Allowed | Claude real-time web search |
| All search engines | Allowed | Google, Bing, etc. |
