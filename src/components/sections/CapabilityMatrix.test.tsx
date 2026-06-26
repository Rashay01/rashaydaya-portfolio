import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

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
  useInView: () => true,
  useReducedMotion: () => false,
}))

import { CapabilityMatrix } from './CapabilityMatrix'
import { skillCategories } from '@/lib/data/skills'

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
})
