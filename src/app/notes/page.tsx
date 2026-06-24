import type { Metadata } from 'next'
import Link from 'next/link'
import { InnerNav } from '@/components/nav/InnerNav'
import { notes } from '@/lib/data/notes'

export const metadata: Metadata = {
  title: 'Engineering Notes',
  description: 'Practical notes on Cloudflare, GitHub Actions, Terraform, production platforms, and Grafana.',
  alternates: { canonical: '/notes' },
}

const sortedNotes = [...notes].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
)

export default function NotesPage() {
  return (
    <main id="main" className="min-h-screen px-4 pb-24 sm:px-6 md:px-10">
      <InnerNav crumbs={[{ label: 'Home', href: '/' }, { label: 'Notes' }]} />
      <section className="mx-auto max-w-3xl pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-filament">WRITING / NOTES</p>
        <h1 className="heading-display mt-5">Engineering notes.</h1>
        <p className="mt-6 max-w-2xl text-lg text-ash">
          Working notes on how I deploy, automate, secure, and observe production systems.
        </p>
        <ol className="mt-16 divide-y divide-ash/10 border-t border-ash/10">
          {sortedNotes.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/notes/${note.slug}`}
                className="block py-7 sm:py-8 transition-colors duration-200 hover:bg-card-hover"
              >
                <time dateTime={note.publishedAt} className="font-mono text-xs uppercase tracking-wide text-ash">
                  {new Date(note.publishedAt).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  · {note.status}
                </time>
                <h2 className="mt-3 font-calsans text-2xl text-satin">{note.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ash">{note.summary}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
