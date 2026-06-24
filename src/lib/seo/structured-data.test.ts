import { buildArticleSchema, buildBreadcrumbSchema, buildPersonSchema, buildSoftwareSchemas, buildWebsiteSchema } from './structured-data'
import type { Note } from '@/lib/data/notes'

describe('structured data', () => {
  it('builds Person and WebSite entities', () => {
    expect(buildPersonSchema()).toMatchObject({ '@type': 'Person', name: 'Rashay Daya' })
    expect(buildWebsiteSchema()).toMatchObject({ '@type': 'WebSite', url: 'https://rashaydaya.co.za' })
  })

  it('only emits SoftwareSourceCode for projects with public repositories', () => {
    const schemas = buildSoftwareSchemas()
    expect(schemas.every((schema) => schema['@type'] === 'SoftwareSourceCode' && schema.codeRepository)).toBe(true)
  })

  it('builds a BreadcrumbList that links every crumb with an href and skips the current page', () => {
    const schema = buildBreadcrumbSchema([
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'House of Chai' },
    ])
    expect(schema).toMatchObject({ '@type': 'BreadcrumbList' })
    expect(schema.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rashaydaya.co.za/' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://rashaydaya.co.za/projects' },
      { '@type': 'ListItem', position: 3, name: 'House of Chai' },
    ])
  })

  it('builds a BlogPosting schema from a note', () => {
    const note: Note = {
      slug: 'example-note',
      title: 'Example Note',
      summary: 'An example summary.',
      status: 'Published',
      publishedAt: '2026-01-01',
      body: ['paragraph'],
    }
    expect(buildArticleSchema(note)).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Example Note',
      datePublished: '2026-01-01',
      url: 'https://rashaydaya.co.za/notes/example-note',
    })
  })
})
