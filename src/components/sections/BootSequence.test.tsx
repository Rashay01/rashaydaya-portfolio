import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const reducedMotion = { current: false }

vi.mock('framer-motion', async () => ({
  ...(await import('@/test/mocks/framer-motion')),
  useReducedMotion: () => reducedMotion.current,
}))

import { BootSequence } from './BootSequence'

beforeEach(() => {
  reducedMotion.current = false
  sessionStorage.clear()
  vi.useRealTimers()
})

describe('BootSequence', () => {
  it('shows the boot overlay on a first visit', () => {
    render(<BootSequence />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('skips straight through under reduced motion', () => {
    reducedMotion.current = true
    render(<BootSequence />)
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  })

  it('does not replay once sessionStorage marks it seen', () => {
    sessionStorage.setItem('boot-sequence-seen', '1')
    render(<BootSequence />)
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  })

  it('skips immediately on click', () => {
    render(<BootSequence />)
    fireEvent.click(screen.getByRole('status', { name: 'Loading' }))
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  })

  it('skips immediately on Escape', () => {
    render(<BootSequence />)
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' })
    })
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  })
})
