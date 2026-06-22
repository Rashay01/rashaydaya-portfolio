import { MetadataRoute } from 'next'
import { caseStudySlugs } from '@/lib/data/case-studies'
import { noteSlugs } from '@/lib/data/notes'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://rashaydaya.co.za', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://rashaydaya.co.za/notes', changeFrequency: 'monthly', priority: 0.7 },
    ...noteSlugs.map((slug) => ({ url: 'https://rashaydaya.co.za/notes/' + slug, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: 'https://rashaydaya.co.za/projects', changeFrequency: 'monthly', priority: 0.8 },
    ...caseStudySlugs.map((slug) => ({ url: 'https://rashaydaya.co.za/projects/' + slug, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
