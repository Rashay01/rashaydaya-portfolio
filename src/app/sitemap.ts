import { MetadataRoute } from 'next'
import { caseStudySlugs } from '@/lib/data/case-studies'
import { getNote, noteSlugs, notes } from '@/lib/data/notes'
import { roadmap } from '@/lib/data/roadmap'

export default function sitemap(): MetadataRoute.Sitemap {
  // Only pages with a real content date get lastModified; Google ignores
  // lastmod once it catches a site guessing, so undated pages stay undated.
  const latestNote = notes.map((note) => note.publishedAt).sort().at(-1)
  return [
    { url: 'https://rashaydaya.co.za', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://rashaydaya.co.za/notes', changeFrequency: 'monthly', priority: 0.7, lastModified: latestNote },
    ...noteSlugs.map((slug) => ({
      url: 'https://rashaydaya.co.za/notes/' + slug,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      lastModified: getNote(slug)?.publishedAt,
    })),
    { url: 'https://rashaydaya.co.za/projects', changeFrequency: 'monthly', priority: 0.8 },
    ...caseStudySlugs.map((slug) => ({ url: 'https://rashaydaya.co.za/projects/' + slug, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: 'https://rashaydaya.co.za/now', changeFrequency: 'weekly', priority: 0.5, lastModified: roadmap.updatedAt },
  ]
}
