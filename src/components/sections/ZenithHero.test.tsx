import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// --- Mocks ---

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
  useReducedMotion: () => false,
}))

// Mock Three.js and R3F — no WebGL renderer available in jsdom
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => React.createElement('div', { 'data-testid': 'r3f-canvas' }, children),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment: () => null,
  useGLTF: () => ({ scene: null }),
  PerspectiveCamera: () => null,
  Float: ({ children }: any) => <>{children}</>,
}))

vi.mock('three', () => ({}))

// Mock the dynamically imported MonolithScene
vi.mock('@/components/three/MonolithScene', () => ({
  default: () => React.createElement('div', { 'data-testid': 'monolith-scene' }),
}))

// Mock next/dynamic to return the mock immediately
vi.mock('next/dynamic', () => ({
  default: (fn: () => Promise<any>, _opts?: any) => {
    // Return a component that renders null — good enough for smoke tests
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

import { ZenithHero } from './ZenithHero'

// ---------------------------------------------------------------------------

describe('ZenithHero', () => {
  it('renders without crashing', () => {
    expect(() => render(<ZenithHero />)).not.toThrow()
  })

  it('renders the h1 heading in the DOM', () => {
    render(<ZenithHero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('section element is present', () => {
    render(<ZenithHero />)
    // The hero section has id="zenith"
    const section = document.getElementById('zenith')
    expect(section).toBeInTheDocument()
  })
})
