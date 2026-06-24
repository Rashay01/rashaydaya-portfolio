import { notes, noteSlugs, getNote } from '@/lib/data/notes'
import { generateMetadata, generateStaticParams } from './page'

describe('note post routes', () => {
  it('pre-renders every note slug', () => {
    expect(generateStaticParams()).toEqual(noteSlugs.map((slug) => ({ slug })))
  })

  it('builds per-note metadata with matching OpenGraph/Twitter title and description', async () => {
    const note = notes[0]
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: note.slug }) })
    expect(metadata.title).toBe(note.title)
    expect(metadata.openGraph).toMatchObject({ title: note.title, description: note.summary, type: 'article' })
    expect(metadata.twitter).toMatchObject({ title: note.title, description: note.summary })
  })

  it('returns empty metadata for an unknown slug', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'does-not-exist' }) })
    expect(metadata).toEqual({})
  })

  it('has published body content for every note', () => {
    for (const note of notes) {
      expect(note.status).toBe('Published')
      expect(getNote(note.slug)).toMatchObject({
        body: expect.any(Array),
      })
      expect(note.body.length).toBeGreaterThan(0)
      for (const paragraph of note.body) {
        expect(paragraph.length).toBeGreaterThan(0)
      }
    }
  })
})
