import { caseStudies, caseStudySlugs, getCaseStudy } from '@/lib/data/case-studies'
import { generateMetadata, generateStaticParams } from './page'

describe('project case-study routes', () => {
  it('pre-renders every approved project slug', () => {
    expect(generateStaticParams()).toEqual(caseStudySlugs.map((slug) => ({ slug })))
  })

  it('builds per-project metadata with matching OpenGraph/Twitter title and description', async () => {
    const study = caseStudies[0]
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: study.slug }) })
    expect(metadata.title).toBe(study.title)
    expect(metadata.openGraph).toMatchObject({ title: study.title, description: study.summary })
    expect(metadata.twitter).toMatchObject({ title: study.title, description: study.summary })
  })

  it('returns empty metadata for an unknown slug', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'does-not-exist' }) })
    expect(metadata).toEqual({})
  })

  it('contains all review sections', () => {
    for (const study of caseStudies) {
      expect(getCaseStudy(study.slug)).toMatchObject({
        overview: expect.any(String), problem: expect.any(String),
        role: expect.any(String), stack: expect.any(Array),
        architecture: expect.any(Object), keyFeatures: expect.any(Array),
        deployment: expect.any(String), security: expect.any(String),
        challenges: expect.any(Array), lessons: expect.any(Array),
        links: expect.any(Array),
      })
    }
  })
})
