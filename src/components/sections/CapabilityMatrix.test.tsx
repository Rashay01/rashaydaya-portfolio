import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'))

import { CapabilityMatrix } from './CapabilityMatrix'
import { skillCategories } from '@/lib/data/skills'
import type { PipelineRun } from '@/lib/data/live-pipeline'

describe('CapabilityMatrix', () => {
  it('renders without crashing', () => {
    expect(() => render(<CapabilityMatrix />)).not.toThrow()
  })

  it('renders the section with the archive id', () => {
    render(<CapabilityMatrix />)
    expect(document.getElementById('archive')).toBeInTheDocument()
  })

  it('renders every skill category header', () => {
    render(<CapabilityMatrix />)
    skillCategories.forEach((category) => {
      expect(screen.getByText(category.header)).toBeInTheDocument()
    })
  })

  it('every category renders a proof link pointing at a real project route', () => {
    render(<CapabilityMatrix />)
    skillCategories.forEach((category) => {
      const link = screen.getByRole('link', { name: new RegExp(category.proof.label) })
      expect(link).toHaveAttribute('href', category.proof.href)
      expect(category.proof.href).toMatch(/^\/projects\//)
    })
  })

  it('does not list any skill without a backing proof link in its category', () => {
    render(<CapabilityMatrix />)
    skillCategories.forEach((category) => {
      expect(category.proof.href.length).toBeGreaterThan(0)
    })
  })

  it('renders each category static stat when there is no live pipeline data', () => {
    render(<CapabilityMatrix livePipeline={null} />)
    skillCategories.forEach((category) => {
      expect(screen.getByText(category.stat.label)).toBeInTheDocument()
    })
  })

  it('renders PASSING on the CI/CD tile for a successful live pipeline run', () => {
    const livePipeline: PipelineRun = {
      status: 'completed',
      conclusion: 'success',
      htmlUrl: 'https://github.com/Rashay01/rashaydaya-portfolio/actions/runs/1',
      updatedAt: new Date().toISOString(),
      jobs: [],
      testSummary: null,
    }
    render(<CapabilityMatrix livePipeline={livePipeline} />)
    expect(screen.getByText('PASSING')).toBeInTheDocument()
    expect(screen.getByText(/LATEST PIPELINE/)).toBeInTheDocument()
  })
})
