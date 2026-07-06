import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { projects } from '@/lib/data/projects'
import { ProjectCard } from './ProjectCard'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const reducedMotion = { current: false }

vi.mock('framer-motion', async () => ({
  ...(await import('@/test/mocks/framer-motion')),
  useReducedMotion: () => reducedMotion.current,
}))

describe('ProjectCard proof actions', () => {
  it('does not advertise a case study without a destination', () => {
    const source = projects.find((item) => item.id === 'house-of-chai')
    const project = source ? { ...source, caseStudySlug: undefined } : undefined
    expect(project).toBeDefined()

    render(<ProjectCard project={project!} />)

    expect(screen.queryByText(/case study/i)).not.toBeInTheDocument()
    expect(screen.getByText('Code Private')).toBeInTheDocument()
  })

  it('links the case study to its dedicated, indexable route', () => {
    const project = projects.find((item) => item.id === 'house-of-chai')
    render(<ProjectCard project={project!} />)

    expect(screen.getByRole('link', { name: 'Case Study' })).toHaveAttribute(
      'href',
      `/projects/${project!.caseStudySlug}`,
    )
  })

  it('uses a full-size touch target for live project links', () => {
    const project = projects.find((item) => item.id === 'house-of-chai')
    render(<ProjectCard project={project!} />)

    expect(screen.getByRole('link', { name: 'Live Site' })).toHaveClass(
      'min-h-[44px]',
    )
  })

  it('shows the border beam on the featured card but not regular cards', () => {
    const project = projects.find((item) => item.id === 'house-of-chai')
    const { container, rerender } = render(<ProjectCard project={project!} featured />)
    expect(container.querySelector('[aria-hidden="true"].overflow-hidden')).toBeInTheDocument()

    rerender(<ProjectCard project={project!} />)
    expect(container.querySelector('[aria-hidden="true"].overflow-hidden')).not.toBeInTheDocument()
  })

  it('skips the border beam under reduced motion', () => {
    reducedMotion.current = true
    const project = projects.find((item) => item.id === 'house-of-chai')
    const { container } = render(<ProjectCard project={project!} featured />)
    expect(container.querySelector('[aria-hidden="true"].overflow-hidden')).not.toBeInTheDocument()
    reducedMotion.current = false
  })

  it('renders a cursor spotlight overlay', () => {
    const project = projects.find((item) => item.id === 'house-of-chai')
    const { container } = render(<ProjectCard project={project!} />)
    const overlay = container.querySelector('[aria-hidden="true"].group-hover\\:opacity-100')
    expect(overlay).toBeInTheDocument()
    expect(overlay?.getAttribute('style')).toContain('radial-gradient')
  })

  it('tracks the cursor position on mousemove via CSS custom properties', () => {
    const project = projects.find((item) => item.id === 'house-of-chai')
    const { container } = render(<ProjectCard project={project!} />)
    const article = container.querySelector('article')!
    fireEvent.mouseMove(article, { clientX: 40, clientY: 60 })
    expect((article as HTMLElement).style.getPropertyValue('--spot-x')).not.toBe('')
    expect((article as HTMLElement).style.getPropertyValue('--spot-y')).not.toBe('')
  })
})
