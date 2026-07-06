import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SystemTray } from './SystemTray'

describe('SystemTray', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-05T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a Cape Town HH:MM time', () => {
    render(<SystemTray />)
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('renders the DEPLOYED label when lastDeploy is given', () => {
    render(<SystemTray lastDeploy="2h ago" />)
    expect(screen.getByText('DEPLOYED 2h ago')).toBeInTheDocument()
  })

  it('omits the DEPLOYED label when lastDeploy is not given', () => {
    render(<SystemTray />)
    expect(screen.queryByText(/DEPLOYED/)).not.toBeInTheDocument()
  })

  it('updates the time on the minute tick', () => {
    render(<SystemTray />)
    const before = screen.getByText(/\d{2}:\d{2}/).textContent
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    const after = screen.getByText(/\d{2}:\d{2}/).textContent
    expect(after).not.toBe(before)
  })
})
