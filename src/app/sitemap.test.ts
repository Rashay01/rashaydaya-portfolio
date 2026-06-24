import { noteSlugs, getNote } from '@/lib/data/notes'
import { caseStudySlugs } from '@/lib/data/case-studies'
import sitemap from './sitemap'

describe('sitemap', () => {
  it('includes every static route, note, and case study exactly once', () => {
    const entries = sitemap()
    const urls = entries.map((entry) => entry.url)
    expect(urls).toContain('https://rashaydaya.co.za')
    expect(urls).toContain('https://rashaydaya.co.za/now')
    for (const slug of noteSlugs) {
      expect(urls).toContain('https://rashaydaya.co.za/notes/' + slug)
    }
    for (const slug of caseStudySlugs) {
      expect(urls).toContain('https://rashaydaya.co.za/projects/' + slug)
    }
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('sets lastModified on note entries from real publishedAt data', () => {
    const entries = sitemap()
    for (const slug of noteSlugs) {
      const entry = entries.find((e) => e.url === 'https://rashaydaya.co.za/notes/' + slug)
      expect(entry?.lastModified).toBe(getNote(slug)?.publishedAt)
    }
  })
})
