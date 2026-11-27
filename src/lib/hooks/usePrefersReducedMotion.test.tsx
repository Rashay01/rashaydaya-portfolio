import { describe, expect, it, vi, afterEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

function Probe() {
  return <span>{usePrefersReducedMotion() ? 'reduced' : 'full'}</span>
}

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('usePrefersReducedMotion', () => {
  it('renders the full-motion value on the server so hydration always matches', () => {
    expect(renderToString(<Probe />)).toContain('full')
  })

  it('reports the visitor preference on the client', () => {
    mockMatchMedia(true)
    render(<Probe />)
    expect(screen.getByText('reduced')).toBeInTheDocument()
  })

  it('reports full motion when the visitor has no preference', () => {
    mockMatchMedia(false)
    render(<Probe />)
    expect(screen.getByText('full')).toBeInTheDocument()
  })
})
