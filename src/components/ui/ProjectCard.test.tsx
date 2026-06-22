import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '@/lib/data/projects'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard proof actions', () => {
  it('does not advertise a case study without a destination', () => {
    const source = projects.find((item) => item.id === 'house-of-chai')
    const project = source ? { ...source, caseStudyUrl: undefined } : undefined
    expect(project).toBeDefined()

    render(<ProjectCard project={project!} />)

    expect(screen.queryByText(/case study/i)).not.toBeInTheDocument()
    expect(screen.getByText('Code Private')).toBeInTheDocument()
  })

  it('uses a full-size touch target for live project links', () => {
    const project = projects.find((item) => item.id === 'house-of-chai')
    render(<ProjectCard project={project!} />)

    expect(screen.getByRole('link', { name: 'Live Site' })).toHaveClass(
      'min-h-[44px]',
    )
  })
})
