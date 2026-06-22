import { render, screen } from '@testing-library/react'
import { caseStudies } from '@/lib/data/case-studies'
import ProjectsIndex from './page'

describe('projects index page', () => {
  it('links to every case study', () => {
    render(<ProjectsIndex />)
    for (const study of caseStudies) {
      expect(screen.getByRole('link', { name: new RegExp(study.title) })).toHaveAttribute(
        'href',
        `/projects/${study.slug}`,
      )
    }
  })
})
