import Link from 'next/link'
import type { ReactNode } from 'react'

// Matches the [text](url) syntax scripts/notes/markdown.mjs validates at build time.
const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

const linkClass =
  'text-satin underline decoration-filament/60 underline-offset-4 transition-colors duration-200 hover:text-filament hover:decoration-filament'

/** Renders a note paragraph or list item, turning [text](url) into real anchors. */
export function NoteText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_LINK)) {
    const [whole, label, href] = match
    const start = match.index ?? 0
    if (start > last) parts.push(text.slice(last, start))
    parts.push(
      href.startsWith('/') ? (
        <Link key={start} href={href} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>
      ),
    )
    last = start + whole.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
