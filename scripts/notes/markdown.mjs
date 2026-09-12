// Minimal markdown parser for content/notes/*.md.
//
// Deliberately small: notes are edited by hand (often from the GitHub web
// UI), so the supported syntax is the handful of block types the site
// actually renders. Anything else fails loudly at build time rather than
// silently rendering wrong.
//
// Supported:
//   ---frontmatter---      key: value lines (title, summary, status,
//                          publishedAt, relatedCaseStudy)
//   Paragraph              consecutive non-blank lines, joined with spaces
//   - item                 bullet list (one item per line)
//   ![alt](/path "cap")    image, with an optional caption in quotes
//   ```mermaid ... ```     Mermaid diagram

const REQUIRED_META = ['title', 'summary', 'publishedAt']
const STATUSES = new Set(['Planned', 'Published'])
const IMAGE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$/

/**
 * @param {string} slug
 * @param {string} source
 */
export function parseNoteMarkdown(slug, source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error(`${slug}.md: file must start with a --- frontmatter block`)

  const meta = parseFrontmatter(slug, match[1])
  const body = parseBlocks(slug, match[2])
  if (body.length === 0) throw new Error(`${slug}.md: note has no body content`)

  return {
    slug,
    title: meta.title,
    summary: meta.summary,
    status: meta.status ?? 'Published',
    publishedAt: meta.publishedAt,
    ...(meta.relatedCaseStudy ? { relatedCaseStudy: meta.relatedCaseStudy } : {}),
    body,
  }
}

/** @param {string} slug @param {string} block */
function parseFrontmatter(slug, block) {
  /** @type {Record<string, string>} */
  const meta = {}
  for (const rawLine of block.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    const colon = line.indexOf(':')
    if (colon === -1) throw new Error(`${slug}.md: frontmatter line "${line}" is not key: value`)
    const key = line.slice(0, colon).trim()
    let value = line.slice(colon + 1).trim()
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1)
    meta[key] = value
  }
  for (const key of REQUIRED_META) {
    if (!meta[key]) throw new Error(`${slug}.md: frontmatter is missing "${key}"`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.publishedAt)) {
    throw new Error(`${slug}.md: publishedAt must be YYYY-MM-DD, got "${meta.publishedAt}"`)
  }
  if (meta.status && !STATUSES.has(meta.status)) {
    throw new Error(`${slug}.md: status must be Planned or Published, got "${meta.status}"`)
  }
  return meta
}

/** @param {string} slug @param {string} text */
function parseBlocks(slug, text) {
  const lines = text.split(/\r?\n/)
  /** @type {Array<string | { items: string[] } | { image: string; alt: string; caption?: string } | { mermaid: string }>} */
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }

    if (/^```mermaid\s*$/.test(line)) {
      const start = i + 1
      let end = start
      while (end < lines.length && !/^```\s*$/.test(lines[end])) end++
      if (end >= lines.length) throw new Error(`${slug}.md: unterminated \`\`\`mermaid block`)
      const definition = lines.slice(start, end).join('\n').trim()
      if (!definition) throw new Error(`${slug}.md: empty mermaid block`)
      blocks.push({ mermaid: definition })
      i = end + 1
      continue
    }

    if (/^```/.test(line)) {
      throw new Error(`${slug}.md: only \`\`\`mermaid code blocks are supported`)
    }

    const image = line.match(IMAGE)
    if (image) {
      const [, alt, src, caption] = image
      if (!src.startsWith('/')) throw new Error(`${slug}.md: image "${src}" must be a /public path`)
      if (!alt.trim()) throw new Error(`${slug}.md: image "${src}" needs alt text`)
      blocks.push({ image: src, alt: alt.trim(), ...(caption ? { caption } : {}) })
      i++
      continue
    }

    if (/^- /.test(line)) {
      const items = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2).trim())
        i++
      }
      blocks.push({ items })
      continue
    }

    const paragraph = []
    while (i < lines.length && lines[i].trim() && !/^(- |!\[|```)/.test(lines[i])) {
      paragraph.push(lines[i].trim())
      i++
    }
    blocks.push(paragraph.join(' '))
  }

  return blocks
}
