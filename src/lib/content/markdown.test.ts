import { describe, expect, it } from 'vitest'
import { parseNoteMarkdown } from '../../../scripts/notes/markdown.mjs'

const frontmatter = `---
title: A test note
summary: Just checking the parser.
publishedAt: 2026-09-12
---
`

describe('parseNoteMarkdown', () => {
  it('reads frontmatter and defaults status to Published', () => {
    const note = parseNoteMarkdown('a-test-note', frontmatter + '\nHello.\n')
    expect(note).toMatchObject({
      slug: 'a-test-note',
      title: 'A test note',
      summary: 'Just checking the parser.',
      publishedAt: '2026-09-12',
      status: 'Published',
    })
    expect(note.relatedCaseStudy).toBeUndefined()
  })

  it('joins wrapped lines into one paragraph and splits on blank lines', () => {
    const note = parseNoteMarkdown('p', frontmatter + '\nLine one\nline two.\n\nSecond paragraph.\n')
    expect(note.body).toEqual(['Line one line two.', 'Second paragraph.'])
  })

  it('parses bullet lists, images with captions, and mermaid blocks', () => {
    const source =
      frontmatter +
      `
Intro.

- first
- second

![Title screen](/notes/x/title.webp "The title screen")

![No caption](/notes/x/plain.webp)

\`\`\`mermaid
stateDiagram-v2
  A --> B
\`\`\`
`
    const note = parseNoteMarkdown('blocks', source)
    expect(note.body).toEqual([
      'Intro.',
      { items: ['first', 'second'] },
      { image: '/notes/x/title.webp', alt: 'Title screen', caption: 'The title screen' },
      { image: '/notes/x/plain.webp', alt: 'No caption' },
      { mermaid: 'stateDiagram-v2\n  A --> B' },
    ])
  })

  it('fails loudly on the mistakes a hand edit is likely to make', () => {
    expect(() => parseNoteMarkdown('x', 'no frontmatter')).toThrow(/frontmatter/)
    expect(() => parseNoteMarkdown('x', '---\ntitle: T\nsummary: S\n---\nbody')).toThrow(/publishedAt/)
    expect(() => parseNoteMarkdown('x', '---\ntitle: T\nsummary: S\npublishedAt: 12/09/2026\n---\nbody')).toThrow(
      /YYYY-MM-DD/,
    )
    expect(() => parseNoteMarkdown('x', frontmatter)).toThrow(/no body/)
    expect(() => parseNoteMarkdown('x', frontmatter + '\n![](/notes/x/a.webp)\n')).toThrow(/alt text/)
    expect(() => parseNoteMarkdown('x', frontmatter + '\n![a](https://elsewhere/a.png)\n')).toThrow(/public path/)
    expect(() => parseNoteMarkdown('x', frontmatter + '\n```js\nlet a\n```\n')).toThrow(/only.*mermaid/)
    expect(() => parseNoteMarkdown('x', frontmatter + '\n```mermaid\nA --> B\n')).toThrow(/unterminated/)
  })
})
