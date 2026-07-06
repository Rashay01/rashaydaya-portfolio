import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// --- Mocks ---

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'))

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

const mockOpenContact = vi.fn()
vi.mock('@/context/ContactContext', () => ({
  useContact: () => ({
    isOpen: false,
    openContact: mockOpenContact,
    closeContact: vi.fn(),
  }),
}))

vi.mock('@/components/ui/FilamentButton', () => ({
  FilamentButton: ({ children, as: Tag = 'a', href, onClick, download, ...rest }: any) =>
    React.createElement(Tag, { href, onClick, download, ...rest }, children),
}))

import { SatinCommandNav } from './SatinCommandNav'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------

describe('SatinCommandNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock requestAnimationFrame so close() works synchronously
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
    // Mock IntersectionObserver (not available in jsdom)
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // --- Nav links ------------------------------------------------------------

  it('renders clear portfolio navigation links', () => {
    render(<SatinCommandNav />)
    for (const label of ['Skills', 'Projects', 'Case Studies', 'Experience', 'Notes', 'Contact']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  // --- CV download ----------------------------------------------------------

  it('CV download button has href /Rashay_Daya_CV.pdf', () => {
    render(<SatinCommandNav />)
    const cvLink = screen.getByRole('link', { name: /download cv/i })
    expect(cvLink).toHaveAttribute('href', '/Rashay_Daya_CV.pdf')
  })

  it('calls toast when CV download button is clicked', () => {
    render(<SatinCommandNav />)
    const cvLink = screen.getByRole('link', { name: /download cv/i })
    fireEvent.click(cvLink)
    expect(toast).toHaveBeenCalled()
  })

  // --- Hamburger / mobile overlay -------------------------------------------

  it('mobile overlay is not visible initially', () => {
    render(<SatinCommandNav />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('hamburger button toggles mobile overlay open', async () => {
    render(<SatinCommandNav />)
    const hamburger = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(hamburger)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('hamburger button toggles mobile overlay closed', async () => {
    render(<SatinCommandNav />)
    const hamburger = screen.getByRole('button', { name: /open menu/i })
    // Open
    fireEvent.click(hamburger)
    await waitFor(() => screen.getByRole('dialog'))
    // aria-label changes to "Close menu" when open
    const closeBtn = screen.getByRole('button', { name: /close menu/i })
    fireEvent.click(closeBtn)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('Escape key closes mobile overlay', async () => {
    render(<SatinCommandNav />)
    const hamburger = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(hamburger)
    await waitFor(() => screen.getByRole('dialog'))

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('mobile overlay contains Contact Me button', async () => {
    render(<SatinCommandNav />)
    const hamburger = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(hamburger)
    await waitFor(() => screen.getByRole('dialog'))
    expect(screen.getByRole('button', { name: /contact me/i })).toBeInTheDocument()
  })
})
