import type { Metadata } from 'next'
import { caseStudies } from '@/lib/data/case-studies'

export const metadata: Metadata = {
  title: 'Projects | Rashay Daya',
  description: 'All case studies: production platforms, infrastructure, and CI/CD systems built by Rashay Daya.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsIndex() {
  return (
    <main id="main" className="min-h-screen px-4 pb-24 sm:px-6 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-5">
        <a href="/" className="logo-mark text-sm">
          RASHAY
        </a>
        <a
          href="/#forge"
          className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-wider text-ash hover:text-satin"
        >
          Back home
        </a>
      </nav>
      <section className="mx-auto max-w-6xl pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-filament">PROJECTS</p>
        <h1 className="heading-display mt-5">All case studies.</h1>
        <p className="mt-6 max-w-2xl text-lg text-ash">
          Production platforms, infrastructure, and CI/CD systems, each with overview, architecture, and proof.
        </p>
        <ol className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ash/10 bg-ash/10 sm:grid-cols-2">
          {caseStudies.map((study, index) => (
            <li key={study.slug} className="bg-card p-6 sm:p-8">
              <a href={`/projects/${study.slug}`} className="block">
                <p className="font-mono text-[10px] uppercase tracking-widest text-filament">
                  {String(index + 1).padStart(2, '0')} / {study.status}
                </p>
                <h2 className="mt-7 font-calsans text-2xl text-satin">{study.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ash">{study.summary}</p>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
