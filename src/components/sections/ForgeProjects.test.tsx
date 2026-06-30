import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ForgeProjects } from './ForgeProjects'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

describe('ForgeProjects recent activity strip', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders commit messages when recentActivity has entries', () => {
    render(
      <ForgeProjects
        livePipeline={null}
        recentActivity={[{ sha: 'abc1234', message: 'fix: thing', date: '2026-06-01', htmlUrl: 'https://github.com/x' }]}
      />,
    )
    expect(screen.getByText(/fix: thing/)).toBeInTheDocument()
  })

  it('renders no commit list when recentActivity is empty (fails closed)', () => {
    render(<ForgeProjects livePipeline={null} recentActivity={[]} />)
    expect(screen.queryByRole('list', { name: '' })).toBeFalsy()
  })
})
