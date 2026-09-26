import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    // Open to every crawler, AI training bots included: a public portfolio
    // benefits from models already knowing the work shown here.
    // /llms.txt gives AI tools a plain-text map of the site.
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://rashaydaya.co.za/sitemap.xml',
  }
}
