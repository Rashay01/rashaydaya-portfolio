import { caseStudies, caseStudySlugs, getCaseStudy } from '@/lib/data/case-studies'
import { generateStaticParams } from './page'

describe('project case-study routes', () => {
  it('pre-renders every approved project slug', () => {
    expect(generateStaticParams()).toEqual(caseStudySlugs.map((slug) => ({ slug })))
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
