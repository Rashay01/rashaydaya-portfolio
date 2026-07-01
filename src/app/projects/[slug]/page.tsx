import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyContent } from '@/components/projects/CaseStudyContent'
import { InnerNav } from '@/components/nav/InnerNav'
import { caseStudySlugs, getCaseStudy } from '@/lib/data/case-studies'
import { buildBreadcrumbSchema } from '@/lib/seo/structured-data'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug)
  if (!study) return {}
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: '/projects/' + study.slug },
    openGraph: { title: study.title, description: study.summary, type: 'article' },
    twitter: { card: 'summary_large_image', title: study.title, description: study.summary },
  }
}

export default async function ProjectCaseStudy({ params }: Props) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: study.title }]

  return (
    <main id="main" className="min-h-screen bg-obsidian px-4 sm:px-6 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(crumbs)) }}
      />
      <InnerNav crumbs={crumbs} />
      <article className="mx-auto max-w-6xl pb-24 pt-14 sm:pt-20">
        <CaseStudyContent study={study} />
      </article>
    </main>
  )
}
