import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag) => {
        const Component = React.forwardRef(({ children, ...rest }: any, ref: any) =>
          React.createElement(String(tag), { ...rest, ref }, children),
        )
        Component.displayName = `motion.${String(tag)}`
        return Component
      },
    },
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { CommandPalette } from './CommandPalette'

function open() {
  render(<CommandPalette />)
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
}

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Command input'), { target: { value } })
  fireEvent.submit(screen.getByLabelText('Command input').closest('form')!)
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
  })

  it('is closed initially', () => {
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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

  it('typing "/help" and pressing Enter prints the command list', async () => {
    open()
    await waitFor(() => screen.getByRole('dialog'))

    type('/help')
    expect(await screen.findByText(/Available commands:/)).toBeInTheDocument()
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
})
