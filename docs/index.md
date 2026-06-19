# Documentation Index

This index lists every documentation file in the repository. Update it whenever a document is added, renamed, or removed.

## Project Documentation

| Document | Purpose |
|---|---|
| [Cloudflare and Performance Fixes](cloudflare-robots-fix.md) | Records Cloudflare crawler controls, robots behavior, and performance-related deployment fixes. |

## Design Specifications

| Document | Purpose |
|---|---|
| [Hero LCP Fix Design](superpowers/specs/2026-05-22-hero-lcp-fix-design.md) | Defines the design and motion strategy for improving hero Largest Contentful Paint behavior. |
| [Portfolio Proof Expansion Design](superpowers/specs/2026-06-19-portfolio-proof-expansion-design.md) | Approved specification for production trust, case studies, evidence, notes, and structured data. |

## Implementation Plans

| Document | Purpose |
|---|---|
| [Hero LCP Fix Implementation Plan](superpowers/plans/2026-05-22-hero-lcp-fix.md) | Task-by-task implementation plan for the hero loading and stagger-reveal work. |
| [Trust and Production Safety Plan](superpowers/plans/2026-06-19-trust-production-safety.md) | Fixes deployment drift, typography integrity, headers, contact security, contrast, motion resilience, and proof honesty. |
| [Portfolio Evidence Plan](superpowers/plans/2026-06-19-portfolio-evidence.md) | Adds typed case studies, architecture diagrams, project evidence, Kaji Labs, current builds, and experience. |
| [Discovery and Structured Data Plan](superpowers/plans/2026-06-19-discovery-structured-data.md) | Adds notes, sitemap coverage, JSON-LD builders, clearer navigation, and a branded not-found page. |

## Maintenance Rule

Before committing documentation changes, run:

```powershell
rg --files docs
```

Compare the output with this index and add any missing document.
