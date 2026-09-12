---
title: How I built a production RSVP platform
summary: Guest validation, RSVP state, controlled media uploads, and deployment boundaries.
status: Published
publishedAt: 2026-06-22
relatedCaseStudy: event-rsvp-platform
---

The event RSVP platform had one constraint that shaped everything else: guests needed to respond and upload photos without an account system, but the data still had to be trustworthy enough to plan a real event around. The answer was validating guest records against a known list at the API layer rather than trusting whatever the client submitted. The React client never decides who counts as a valid guest, it just calls a service that does.

RSVP state lives in Firebase, which made sense for write-heavy, loosely structured guest responses without standing up a separate database for a single event. The tradeoff is that Firebase security rules are doing real access-control work, not just convenience, so the rules were written to match the same validation boundary as the API, not left at permissive defaults.

Media uploads were the riskiest part of the brief: guests uploading photos directly to storage is exactly the kind of flow that leaks credentials if done carelessly. Uploads go through the Node.js service, which issues a scoped, short-lived path to Cloudflare R2 rather than handing out storage credentials to the browser. The browser never holds anything it could replay or misuse after the upload completes.

Keeping the client, the validation service, and storage as separate deployable pieces meant a media-handling bug could be fixed and redeployed without touching the guest-facing UI at all, which mattered close to the event date, when the cost of an unrelated regression is much higher than usual.
