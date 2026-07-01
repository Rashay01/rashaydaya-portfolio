import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectsView } from './ProjectsView'

const caseStudies = [
  {
    slug: 'house-of-chai',
    title: 'The House of Chai Platform',
    summary: 'A test summary.',
    status: 'Live' as const,
    stack: ['React', 'Cloudflare Pages'],
  },
  {
    slug: 'monitoring-dashboard',
    title: 'Monitoring Dashboard',
    summary: 'Another test summary.',
    status: 'In progress' as const,
    stack: ['Grafana', 'Prometheus'],
  },
] as Parameters<typeof ProjectsView>[0]['caseStudies']

describe('ProjectsView', () => {
  it('defaults to the list view linking every case study', () => {
    render(<ProjectsView caseStudies={caseStudies} />)
    for (const study of caseStudies) {
      expect(screen.getByRole('link', { name: new RegExp(study.title) })).toHaveAttribute(
        'href',
        `/projects/${study.slug}`,
      )
    }
    expect(screen.queryByRole('img', { name: /systems map/i })).not.toBeInTheDocument()
  })

  it('switches to the systems map view on toggle', () => {
    render(<ProjectsView caseStudies={caseStudies} />)
    fireEvent.click(screen.getByRole('button', { name: 'Systems Map' }))

    expect(screen.getByRole('img', { name: /systems map/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: new RegExp(caseStudies[0].title) })).not.toBeInTheDocument()
  })

  it('filters the list by technology via the drawer', () => {
    render(<ProjectsView caseStudies={caseStudies} />)

    // Open the filter drawer
    fireEvent.click(screen.getByRole('button', { name: /filter/i }))
    expect(screen.getByRole('dialog', { name: /filter projects/i })).toBeInTheDocument()

    // All is active by default
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')

    // Select a tech — drawer closes and list is filtered
    fireEvent.click(screen.getByRole('button', { name: 'Grafana' }))
    expect(screen.getByRole('link', { name: new RegExp(caseStudies[1].title) })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: new RegExp(caseStudies[0].title) })).not.toBeInTheDocument()
  })
})
