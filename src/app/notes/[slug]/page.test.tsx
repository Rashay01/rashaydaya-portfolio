import { notes, noteSlugs, getNote } from '@/lib/data/notes'
import { generateStaticParams } from './page'

describe('note post routes', () => {
  it('pre-renders every note slug', () => {
    expect(generateStaticParams()).toEqual(noteSlugs.map((slug) => ({ slug })))
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
