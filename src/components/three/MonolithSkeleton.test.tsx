import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MonolithSkeleton } from './MonolithSkeleton'

describe('MonolithSkeleton', () => {
  it('renders without crashing', () => {
    expect(() => render(<MonolithSkeleton />)).not.toThrow()
  })

  it('applies skeleton-shimmer class to the monolith silhouette', () => {
    const { container } = render(<MonolithSkeleton />)
    const shimmerEls = container.querySelectorAll('.skeleton-shimmer')
    expect(shimmerEls.length).toBeGreaterThan(0)
  })

  it('renders the line placeholders', () => {
    const { container } = render(<MonolithSkeleton />)
    // Three terminal-line skeleton bars + 1 monolith block = 4 shimmer elements
    const shimmerEls = container.querySelectorAll('.skeleton-shimmer')
    expect(shimmerEls.length).toBe(4)
  })

  it('has no text content — purely visual placeholder', () => {
    const { container } = render(<MonolithSkeleton />)
    expect(container.textContent).toBe('')
  })
})
