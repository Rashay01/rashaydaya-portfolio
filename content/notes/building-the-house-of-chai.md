---
title: Building The House of Chai
summary: A pre-rendered React site with a server-side signing layer for bookings.
status: Published
publishedAt: 2026-11-27
relatedCaseStudy: house-of-chai
---

[The House of Chai](https://thehouseofchai.co.za/) is a luxury travelling chai house in Johannesburg: a styled chai cart, house spice blends and ritual hosts for weddings, private celebrations, corporate events and hotels. The site has two jobs. It has to carry that experience well enough that someone planning an event wants to book, and it has to get a booking enquiry to the business without anything going missing on the way.

The frontend is React 19, TypeScript, Vite and Tailwind CSS v4, deployed on Cloudflare Pages. It is a static build, so most of the interesting decisions sit at the two edges: how the content reaches crawlers, and how a form submission reaches the backend.

A plain Vite build ships one HTML shell and renders everything in the browser, which leaves search engines and AI crawlers that don't run JavaScript looking at an empty page. So each page is pre-rendered at build time with its own title, description, canonical URL and JSON-LD, and the site publishes an llms.txt alongside it. What a crawler reads is the same content a visitor sees, without waiting on a script.

Booking and contact forms don't talk to the backend directly. They post to a Cloudflare Pages Function, which signs the request with HMAC on the server and forwards it to a Fastify backend on Railway. The backend only accepts signed requests, and the signing secret lives in the Function's environment, so it never reaches the browser or the frontend bundle.

Accessibility was part of the build rather than a pass at the end:

- Text and controls meet WCAG AA contrast.
- Form errors are labelled and announced to screen readers, not just coloured red.
- Date and option pickers work from the keyboard.
- Motion respects the reduced-motion setting.

The split is the part I would reuse on the next project: a static frontend that is fully readable without JavaScript, and a thin server-side layer that holds the one secret and is the only thing allowed to talk to the API.
