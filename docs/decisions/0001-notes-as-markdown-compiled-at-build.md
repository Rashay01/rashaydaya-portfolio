# ADR 0001: Notes are markdown files compiled to JSON at build time

Date: 2026-09-12
Status: Accepted
Ticket: TICKET-0054, PR #38

## Context

Notes lived as a TypeScript array in `src/lib/data/notes.ts`. Adding one meant
editing code, and there was no way to include a photo or a diagram. The owner
wants to publish a note with images from a phone or the GitHub website, and
wants nobody else to be able to.

The site runs as a Cloudflare Worker via OpenNext. The Worker has no
filesystem at runtime, so the common Next.js pattern of reading
`content/*.md` with `fs` inside a server component is unsafe here: the module
would throw if the route ever rendered outside the build.

## Options considered

1. Keep notes in TypeScript. No change, no photos, requires code for every note.
2. Read markdown with `fs` at request time in the page. Standard Next.js
   pattern, but depends on the filesystem existing in the Worker.
3. Compile markdown to JSON before `next build` with a script, import the
   JSON. Filesystem only touched at build.
4. Headless CMS with runtime storage (R2, KV) behind Cloudflare Access.
   Live edits without a deploy, but the most moving parts and a new auth
   surface.
5. Git-backed editor (Keystatic, Decap) writing markdown to the repo.
   Complementary to 3, not a replacement.

## Decision

Option 3. Markdown in `content/notes/<slug>.md` with frontmatter is the
source of truth. `scripts/build-notes.mjs` compiles it to a gitignored
`src/lib/data/notes.generated.json` and runs from the `prebuild` and `predev`
npm hooks and the Vitest global setup. OpenNext invokes `npm run build`, so
deploys pick up edits made from the GitHub UI with no extra step.

The parser (`scripts/notes/markdown.mjs`) is deliberately small: paragraphs,
bullet lists, images with optional captions, and `mermaid` fences. That is
the full set of block types the page renders, so nothing can reach the site
looking wrong. Any other input fails the build with the file name and reason.
Images must exist under `public/` or the build fails.

Authorisation is repository write access. No login system on the site.

## Consequences

- Publishing a note is: add a markdown file, upload images, open a PR, merge.
- The generated JSON is never edited or committed. Anyone cloning the repo
  gets it on first `npm run dev`, `npm run build`, or test run.
- Inline markdown (bold, links, code spans) is shown as typed. Adding it
  later means extending the parser and the renderer together.
- Option 5 remains open as TICKET-0055 once the markdown flow has been used
  enough to know where the friction is.
