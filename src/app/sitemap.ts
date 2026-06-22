import { MetadataRoute } from 'next'
import { caseStudySlugs } from '@/lib/data/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rashaydaya.co.za',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    { url: 'https://rashaydaya.co.za/notes', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...caseStudySlugs.map((slug) => ({ url: 'https://rashaydaya.co.za/projects/' + slug, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
