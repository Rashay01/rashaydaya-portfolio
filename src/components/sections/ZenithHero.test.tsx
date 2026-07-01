import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// --- Mocks ---

const reducedMotion = { current: false }

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_, tag) =>
        ({ children, ...rest }: any) =>
          React.createElement(String(tag), rest, children),
    },
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => reducedMotion.current,
}))

// Mock the dynamically imported MonolithScene and its skeleton, no WebGL
// renderer available in jsdom, and this replaces the module wholesale so
// its internal three.js imports never execute.
vi.mock('@/components/three/MonolithScene', () => ({
  default: () => React.createElement('div', { 'data-testid': 'monolith-scene' }),
}))

vi.mock('@/components/three/MonolithSkeleton', () => ({
  MonolithSkeleton: () => React.createElement('div', { 'data-testid': 'monolith-skeleton' }),
}))

// Mock next/dynamic to return the mock immediately
vi.mock('next/dynamic', () => ({
  default: (fn: () => Promise<any>, _opts?: any) => {
    // Return a component that renders null, good enough for smoke tests
    const MockDynamic = () => null
    MockDynamic.displayName = 'MockDynamic'
    return MockDynamic
  },
}))

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: () => false,
}))

vi.mock('@/components/ui/MonoLabel', () => ({
  MonoLabel: ({ children, className }: any) => <span className={className}>{children}</span>,
}))

vi.mock('@/components/ui/DisplayHeading', () => ({
  DisplayHeading: ({ children, as: Tag = 'h1', id }: any) =>
    React.createElement(Tag, { id }, children),
}))

vi.mock('@/components/ui/FilamentButton', () => ({
  FilamentButton: ({ children, as: Tag = 'a', href, onClick, ...rest }: any) =>
    React.createElement(Tag, { href, onClick, ...rest }, children),
}))

vi.mock('@/context/ContactContext', () => ({
  useContact: () => ({
    isOpen: false,
    openContact: vi.fn(),
    closeContact: vi.fn(),
  }),
}))

const gsapCreateSpy = vi.fn()
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    timeline: () => ({ to: vi.fn() }),
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: gsapCreateSpy },
}))

import { ZenithHero } from './ZenithHero'

// ---------------------------------------------------------------------------

describe('ZenithHero', () => {
  it('renders without crashing', () => {
    expect(() => render(<ZenithHero cvUpdatedLabel="June 2026" />)).not.toThrow()
  })

  it('renders the h1 heading in the DOM', () => {
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('section element is present with correct id', () => {
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    const section = document.getElementById('zenith')
    expect(section).toBeInTheDocument()
  })

  it('renders desktop Three.js container in DOM (CSS-hidden on mobile)', () => {
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    // The desktop container is always in the DOM, CSS handles visibility via md: prefix
    // It contains the MonolithScene (mocked as null by next/dynamic mock)
    const { container } = render(<ZenithHero cvUpdatedLabel="June 2026" />)
    // Desktop container has class hidden md:block
    const desktopContainers = container.querySelectorAll('.hidden.md\\:block')
    expect(desktopContainers.length).toBeGreaterThan(0)
  })

  it('renders mobile fallback in DOM (CSS-hidden on desktop)', () => {
    const { container } = render(<ZenithHero cvUpdatedLabel="June 2026" />)
    // Mobile fallback has class block md:hidden
    const mobileContainers = container.querySelectorAll('.block.md\\:hidden')
    expect(mobileContainers.length).toBeGreaterThan(0)
  })

  it('mobile fallback contains Cape Town location', () => {
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    expect(screen.getByText(/CAPE TOWN, SOUTH AFRICA/i)).toBeInTheDocument()
  })

  it('shows Cape Town as the visible location', () => {
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    expect(screen.getByText(/CAPE TOWN, SOUTH AFRICA/i)).toBeInTheDocument()
    expect(screen.queryByText(/JOHANNESBURG/i)).not.toBeInTheDocument()
  })

  it('keeps professional profile actions visible in the hero', () => {
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByText(/CV updated: June 2026/i)).toBeInTheDocument()
  })

  it('skips the GSAP ScrollTrigger scroll moment under prefers-reduced-motion', async () => {
    reducedMotion.current = true
    gsapCreateSpy.mockClear()
    render(<ZenithHero cvUpdatedLabel="June 2026" />)
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(gsapCreateSpy).not.toHaveBeenCalled()
    reducedMotion.current = false
  })
})
