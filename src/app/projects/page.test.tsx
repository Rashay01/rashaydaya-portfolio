import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { caseStudies } from '@/lib/data/case-studies'
import ProjectsIndex from './page'

vi.mock('@/context/ContactContext', () => ({
  useContact: () => ({ openContact: vi.fn(), closeContact: vi.fn(), isOpen: false }),
}))

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
