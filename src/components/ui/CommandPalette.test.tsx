import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'))

import { CommandPalette } from './CommandPalette'

function open() {
  render(<CommandPalette />)
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
}

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Command input'), { target: { value } })
  fireEvent.submit(screen.getByLabelText('Command input').closest('form')!)
}

function pressArrow(key: 'ArrowUp' | 'ArrowDown') {
  fireEvent.keyDown(screen.getByLabelText('Command input'), { key })
}

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    pushMock.mockClear()
  })

  it('is closed initially', () => {
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clicking the bottom-left console launcher opens the palette, then hides itself', async () => {
    render(<CommandPalette />)
    fireEvent.click(screen.getByTitle('Open console (Ctrl/Cmd+K)'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.queryByTitle('Open console (Ctrl/Cmd+K)')).not.toBeInTheDocument()
  })

  it('Ctrl+K opens the palette', async () => {
    open()
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('Cmd+K (Mac) opens the palette', async () => {
    render(<CommandPalette />)
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('Escape closes the palette', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('typing "cat resume.pdf" and pressing Enter downloads the CV', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    type('cat resume.pdf')

    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(/Downloading resume\.pdf/)).toBeInTheDocument()
  })

  it('typing "whoami" and pressing Enter prints an identity blurb', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('whoami')
    expect(await screen.findByText(/Rashay Daya/)).toBeInTheDocument()
  })

  it('typing "/help" and pressing Enter lists each command on its own line', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('/help')
    expect(await screen.findByText('/clear')).toBeInTheDocument()
    expect(screen.getByText('cat resume.pdf')).toBeInTheDocument()
    expect(screen.getByText('whoami')).toBeInTheDocument()
    expect(screen.getByText('ls projects')).toBeInTheDocument()
  })

  it('typing "show terraform" navigates to the filtered projects route and closes', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('show terraform')
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/projects?tech=Terraform')
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('typing "show cobol" reports no match without navigating', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('show cobol')
    expect(await screen.findByText(/no match for "cobol"/)).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('typing "/close" and pressing Enter closes the palette', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('/close')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('Tab completes an unambiguous command prefix', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    fireEvent.change(screen.getByLabelText('Command input'), { target: { value: '/cle' } })
    fireEvent.keyDown(screen.getByLabelText('Command input'), { key: 'Tab' })
    expect(screen.getByLabelText('Command input')).toHaveValue('/clear')
  })

  it('Tab does nothing for an ambiguous prefix matching multiple commands', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    fireEvent.change(screen.getByLabelText('Command input'), { target: { value: '/cl' } })
    fireEvent.keyDown(screen.getByLabelText('Command input'), { key: 'Tab' })
    expect(screen.getByLabelText('Command input')).toHaveValue('/cl')
  })

  it('typing "/clear" and pressing Enter wipes the scrollback', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('whoami')
    expect(await screen.findByText(/Rashay Daya/)).toBeInTheDocument()

    type('/clear')
    expect(screen.queryByText(/Rashay Daya/)).not.toBeInTheDocument()
    expect(screen.queryByText('whoami')).not.toBeInTheDocument()
  })

  it('typing "ls projects" and pressing Enter prints case study links', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('ls projects')
    const links = await screen.findAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('an unrecognized command prints "command not found"', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('rm -rf /')
    expect(await screen.findByText(/command not found: rm -rf \//)).toBeInTheDocument()
  })

  it('clears the input after submitting', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('whoami')
    expect(screen.getByLabelText('Command input')).toHaveValue('')
  })

  it('ArrowUp recalls previously typed commands, most recent first', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('whoami')
    await screen.findByText(/Rashay Daya/)
    type('/help')
    await screen.findByText('/clear')
    type('ls projects')
    await screen.findAllByRole('link')

    pressArrow('ArrowUp')
    expect(screen.getByLabelText('Command input')).toHaveValue('ls projects')
    pressArrow('ArrowUp')
    expect(screen.getByLabelText('Command input')).toHaveValue('/help')
    pressArrow('ArrowUp')
    expect(screen.getByLabelText('Command input')).toHaveValue('whoami')
    // Stays on the oldest entry instead of wrapping or erroring.
    pressArrow('ArrowUp')
    expect(screen.getByLabelText('Command input')).toHaveValue('whoami')
  })

  it('ArrowDown walks history forward and clears back to a blank prompt', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('whoami')
    await screen.findByText(/Rashay Daya/)
    type('/help')
    await screen.findByText('/clear')

    pressArrow('ArrowUp')
    pressArrow('ArrowUp')
    expect(screen.getByLabelText('Command input')).toHaveValue('whoami')
    pressArrow('ArrowDown')
    expect(screen.getByLabelText('Command input')).toHaveValue('/help')
    pressArrow('ArrowDown')
    expect(screen.getByLabelText('Command input')).toHaveValue('')
  })
})
