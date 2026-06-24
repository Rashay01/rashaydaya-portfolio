import type { Metadata } from 'next'
import { InnerNav } from '@/components/nav/InnerNav'
import { caseStudies } from '@/lib/data/case-studies'
import { ProjectsView } from '@/components/projects/ProjectsView'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'All case studies: production platforms, infrastructure, and CI/CD systems built by Rashay Daya.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsIndex() {
  return (
    <main id="main" className="min-h-screen px-4 pb-24 sm:px-6 md:px-10">
      <InnerNav crumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
      <section className="mx-auto max-w-6xl pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-filament">PROJECTS</p>
        <h1 className="heading-display mt-5">All case studies.</h1>
        <p className="mt-6 max-w-2xl text-lg text-ash">
          Production platforms, infrastructure, and CI/CD systems, each with overview, architecture, and proof.
        </p>
        <ProjectsView caseStudies={caseStudies} />
      </section>
    </main>
  )
}
