// Notes are authored as markdown in content/notes/*.md and compiled to
// notes.generated.json by scripts/build-notes.mjs (prebuild, predev, and the
// Vitest global setup all run it). Edit the markdown, never this file or the
// JSON. See docs/adding-a-note.md for the no-code workflow.
import generated from './notes.generated.json'

// A body block is a prose paragraph, a short bullet list, an image with
// optional caption, or a Mermaid diagram. Most notes are paragraph-only.
export type NoteBodyBlock =
  | string
  | { items: string[] }
  | { image: string; alt: string; caption?: string }
  | { mermaid: string }

export type Note = {
  slug: string
  title: string
  summary: string
  status: 'Planned' | 'Published'
  body: NoteBodyBlock[]
  relatedCaseStudy?: string
  publishedAt: string
}

export const notes: Note[] = generated as Note[]

export const noteSlugs = notes.map((note) => note.slug)

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug)
}
