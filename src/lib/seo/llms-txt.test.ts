import { caseStudies } from '@/lib/data/case-studies'
import { notes } from '@/lib/data/notes'
import { buildLlmsTxt } from './llms-txt'

describe('llms.txt', () => {
  it('opens with an H1 and a blockquote summary, per llmstxt.org', () => {
    const [h1, , summary] = buildLlmsTxt().split('\n')
    expect(h1).toBe('# Rashay Daya')
    expect(summary).toMatch(/^> /)
  })

  it('links every case study and every published note', () => {
    const body = buildLlmsTxt()
    for (const study of caseStudies) {
      expect(body).toContain('https://rashaydaya.co.za/projects/' + study.slug)
    }
    for (const note of notes.filter((n) => n.status === 'Published')) {
      expect(body).toContain('https://rashaydaya.co.za/notes/' + note.slug)
    }
  })
})
