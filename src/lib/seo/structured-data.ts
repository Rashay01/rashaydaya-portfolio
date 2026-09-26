import { caseStudies } from '@/lib/data/case-studies'
import type { Note } from '@/lib/data/notes'

export const SITE_URL = 'https://rashaydaya.co.za'

// Stable @ids let every page's JSON-LD point at the same Person and WebSite
// entities instead of re-declaring anonymous copies, which is how Google ties
// notes, the profile page, and the site together as one author's work.
const PERSON_ID = SITE_URL + '/#person'
const WEBSITE_ID = SITE_URL + '/#website'
const personRef = { '@type': 'Person', '@id': PERSON_ID, name: 'Rashay Daya', url: SITE_URL }

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Rashay Daya',
    jobTitle: 'Junior DevOps Engineer and Full Stack Developer',
    url: SITE_URL,
    address: { '@type': 'PostalAddress', addressLocality: 'Cape Town', addressRegion: 'Western Cape', addressCountry: 'ZA' },
    knowsAbout: ['DevOps', 'AWS', 'Terraform', 'GitHub Actions', 'CI/CD', 'Cloudflare', 'Next.js', 'TypeScript', 'Node.js'],
    sameAs: ['https://github.com/Rashay01', 'https://za.linkedin.com/in/rashay-daya-795804262'],
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Rashay Daya Portfolio',
    url: SITE_URL,
    inLanguage: 'en-ZA',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  }
}

// Google's ProfilePage rich result: the homepage is primarily about one person.
export function buildProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': SITE_URL + '/#profilepage',
    url: SITE_URL,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
  }
}

export function buildBreadcrumbSchema(crumbs: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: SITE_URL + crumb.href } : {}),
    })),
  }
}

export function buildArticleSchema(note: Note) {
  const url = SITE_URL + '/notes/' + note.slug
  const images = note.body.flatMap((block) =>
    typeof block === 'object' && 'image' in block ? [SITE_URL + block.image] : [],
  )
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url + '#article',
    headline: note.title,
    description: note.summary,
    datePublished: note.publishedAt,
    dateModified: note.publishedAt,
    url,
    mainEntityOfPage: url,
    image: images.length > 0 ? images : [SITE_URL + '/opengraph-image'],
    inLanguage: 'en-ZA',
    author: personRef,
    publisher: personRef,
    isPartOf: { '@id': WEBSITE_ID },
  }
}

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
      url: SITE_URL + '/projects/' + study.slug,
      codeRepository: repo.href,
      programmingLanguage: study.stack,
      author: { '@id': PERSON_ID },
    }))
}
