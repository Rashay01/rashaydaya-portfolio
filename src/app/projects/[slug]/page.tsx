import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyContent } from '@/components/projects/CaseStudyContent'
import { caseStudySlugs, getCaseStudy } from '@/lib/data/case-studies'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug)
  if (!study) return {}
  return {
    title: study.title + ' | Rashay Daya',
    description: study.summary,
    alternates: { canonical: '/projects/' + study.slug },
  }
}

export default async function ProjectCaseStudy({ params }: Props) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()

  return (
    <main id="main" className="min-h-screen bg-obsidian px-4 sm:px-6 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-5">
        <a href="/" className="logo-mark text-sm">
          RASHAY
        </a>
        <a
          href="/#forge"
          className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-wider text-ash hover:text-satin"
        >
          All projects
        </a>
      </nav>
      <article className="mx-auto max-w-6xl pb-24 pt-14 sm:pt-20">
        <CaseStudyContent study={study} />
      </article>
    </main>
  )
}
