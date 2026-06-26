import { notFound } from 'next/navigation'
import { CaseStudyModal } from '@/components/projects/CaseStudyModal'
import { caseStudySlugs, getCaseStudy } from '@/lib/data/case-studies'

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }))
}

export default async function CaseStudyInterceptedModal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()

  return <CaseStudyModal study={study} />
}
