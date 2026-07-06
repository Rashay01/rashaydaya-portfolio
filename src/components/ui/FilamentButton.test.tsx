import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FilamentButton } from './FilamentButton'

describe('FilamentButton', () => {
  it('renders its children', () => {
    render(<FilamentButton href="#">Click me</FilamentButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('as="button" produces a <button>', () => {
    render(<FilamentButton as="button">Go</FilamentButton>)
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
  })

  it('defaults to an <a>', () => {
    render(<FilamentButton href="#">Go</FilamentButton>)
    expect(screen.getByRole('link', { name: 'Go' })).toBeInTheDocument()
  })
})
