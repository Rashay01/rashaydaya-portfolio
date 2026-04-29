import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rashaydaya.co.za',
      lastModified: new Date('2026-04-29'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
