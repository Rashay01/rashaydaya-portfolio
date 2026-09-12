#!/usr/bin/env node
// Turns content/notes/*.md into src/lib/data/notes.generated.json.
//
// Runs automatically before `next build` and `next dev` (see package.json
// prebuild/predev) and before the Vitest suite (src/test/global-setup.ts),
// so the markdown files are the only thing anyone edits. The Cloudflare
// Worker has no filesystem at runtime, which is why this happens at build
// time instead of reading the files inside the page.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseNoteMarkdown } from './notes/markdown.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'notes')
const PUBLIC_DIR = path.join(ROOT, 'public')
const OUT_FILE = path.join(ROOT, 'src', 'lib', 'data', 'notes.generated.json')

export function buildNotes() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort()
  const notes = files.map((file) => {
    const slug = file.slice(0, -3)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`${file}: file name must be lowercase-with-dashes, it becomes the URL`)
    }
    return parseNoteMarkdown(slug, fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'))
  })

  for (const note of notes) {
    for (const block of note.body) {
      if (typeof block === 'object' && 'image' in block) {
        const onDisk = path.join(PUBLIC_DIR, block.image)
        if (!fs.existsSync(onDisk)) {
          throw new Error(`${note.slug}.md: image ${block.image} not found under public/`)
        }
      }
    }
  }

  notes.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title))

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(notes, null, 2) + '\n')
  return notes
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const notes = buildNotes()
  console.log(`notes: wrote ${notes.length} notes to ${path.relative(ROOT, OUT_FILE)}`)
}
