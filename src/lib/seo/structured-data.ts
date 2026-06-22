import { caseStudies } from '@/lib/data/case-studies'

export function buildPersonSchema() { return { '@context': 'https://schema.org', '@type': 'Person', name: 'Rashay Daya', jobTitle: 'Junior DevOps Engineer and Full Stack Developer', url: 'https://rashaydaya.co.za', address: { '@type': 'PostalAddress', addressLocality: 'Cape Town', addressRegion: 'Western Cape', addressCountry: 'ZA' }, sameAs: ['https://github.com/Rashay01', 'https://za.linkedin.com/in/rashay-daya-795804262'] } }
export function buildWebsiteSchema() { return { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Rashay Daya Portfolio', url: 'https://rashaydaya.co.za', author: { '@type': 'Person', name: 'Rashay Daya' } } }

// Sourced from case-studies.ts (the canonical project model used by the
// sitemap and /projects pages) instead of a second projects.ts, so schema
// can't drift from what's actually on the page.
export function buildSoftwareSchemas() {
  return caseStudies
    .map((study) => ({ study, repo: study.links.find((link) => link.href.includes('github.com')) }))
    .filter((entry): entry is { study: typeof caseStudies[number]; repo: NonNullable<typeof entry.repo> } => Boolean(entry.repo))
    .map(({ study, repo }) => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: study.title,
      description: study.summary,
      codeRepository: repo.href,
      programmingLanguage: study.stack,
    }))
}
