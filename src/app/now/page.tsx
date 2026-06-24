import type { Metadata } from 'next'
import { InnerNav } from '@/components/nav/InnerNav'
import { roadmap } from '@/lib/data/roadmap'

export const metadata: Metadata = {
  title: 'Now | Rashay Daya',
  description: 'What Rashay Daya is currently focused on and learning.',
  alternates: { canonical: '/now' },
}

export default function NowPage() {
  return (
    <main id="main" className="min-h-screen px-4 pb-24 sm:px-6 md:px-10">
      <InnerNav crumbs={[{ label: 'Home', href: '/' }, { label: 'Now' }]} />
      <section className="mx-auto max-w-3xl pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-filament">NOW</p>
        <h1 className="heading-display mt-5">What I&apos;m working on.</h1>
        <p className="mt-6 text-sm font-mono uppercase tracking-wide text-ash">
          Last updated{' '}
          <time dateTime={roadmap.updatedAt}>
            {new Date(roadmap.updatedAt).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </p>

        <section className="mt-14 border-t border-ash/10 pt-10">
          <h2 className="font-calsans text-2xl text-satin">Current focus</h2>
          <ul className="mt-5 grid gap-3 text-satin/80">
            {roadmap.currentFocus.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t border-ash/10 pt-10">
          <h2 className="font-calsans text-2xl text-satin">Learning</h2>
          <p className="mt-3 text-sm text-ash">
            Active learning, not aspirational keyword stuffing — these don&apos;t have a
            shipped project behind them yet.
          </p>
          <ul className="mt-5 grid gap-3 text-satin/80">
            {roadmap.learning.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
