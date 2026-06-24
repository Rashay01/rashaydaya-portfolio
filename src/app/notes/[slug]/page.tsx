import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { InnerNav } from '@/components/nav/InnerNav'
import { getNote, noteSlugs } from '@/lib/data/notes'
import { getCaseStudy } from '@/lib/data/case-studies'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/structured-data'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return noteSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = getNote((await params).slug)
  if (!note) return {}
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: '/notes/' + note.slug },
    openGraph: { title: note.title, description: note.summary, type: 'article', publishedTime: note.publishedAt },
    twitter: { card: 'summary_large_image', title: note.title, description: note.summary },
  }
}

export default async function NotePost({ params }: Props) {
  const note = getNote((await params).slug)
  if (!note) notFound()
  const relatedStudy = note.relatedCaseStudy ? getCaseStudy(note.relatedCaseStudy) : undefined
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Notes', href: '/notes' }, { label: note.title }]
  const jsonLd = [buildArticleSchema(note), buildBreadcrumbSchema(crumbs)]

  return (
    <main id="main" className="min-h-screen bg-obsidian px-4 pb-24 sm:px-6 md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InnerNav crumbs={crumbs} />
      <article className="mx-auto max-w-3xl pt-14 sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-widest text-filament">
          NOTE / {new Date(note.publishedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="heading-display mt-5">{note.title}</h1>
        <p className="mt-6 text-lg text-ash">{note.summary}</p>
        <div className="mt-12 space-y-6 text-base leading-relaxed text-ash">
          {note.body.map((block, index) =>
            typeof block === 'string' ? (
              <p key={index}>{block}</p>
            ) : (
              <ul key={index} className="list-disc space-y-2 pl-5">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </div>
        {relatedStudy && (
          <p className="mt-12 border-t border-ash/10 pt-6 font-mono text-xs text-ash">
            Built on this:{' '}
            <Link href={`/projects/${relatedStudy.slug}`} className="text-filament hover:text-signal">
              {relatedStudy.title}
            </Link>
          </p>
        )}
      </article>
    </main>
  )
}
