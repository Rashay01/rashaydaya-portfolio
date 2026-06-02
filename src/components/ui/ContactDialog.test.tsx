import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

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

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

vi.mock('@/components/ui/FilamentButton', () => ({
  FilamentButton: ({ children, as: Tag = 'button', ...rest }: any) =>
    React.createElement(Tag, rest, children),
}))

vi.mock('@/components/ui/MonoLabel', () => ({
  MonoLabel: ({ children }: any) => <span>{children}</span>,
}))

// Stable mock functions so the effect dependency doesn't flip on every render
const mockCloseContact = vi.fn()
const mockOpenContact = vi.fn()

let mockIsOpen = true

vi.mock('@/context/ContactContext', () => ({
  useContact: () => ({
    get isOpen() {
      return mockIsOpen
    },
    openContact: mockOpenContact,
    closeContact: mockCloseContact,
  }),
}))

import { ContactDialog } from './ContactDialog'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------

describe('ContactDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsOpen = true
    global.fetch = vi.fn()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // --- Visibility -----------------------------------------------------------

  it('renders the dialog when isOpen is true', () => {
    render(<ContactDialog />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('does NOT render the dialog when isOpen is false', () => {
    mockIsOpen = false
    render(<ContactDialog />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // --- Validation -----------------------------------------------------------

  it('shows name validation error after submitting with empty name', async () => {
    render(<ContactDialog />)
    // Submit with empty fields — this sets touched.name = true and the error appears
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /transmit/i }))
    })
    await waitFor(() => {
      // At least one alert should appear (name is required)
      const alerts = screen.getAllByRole('alert')
      expect(alerts.some((el) => el.id === 'err-name')).toBe(true)
    })
  })

  it('shows email validation error after submitting with invalid email', async () => {
    render(<ContactDialog />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    // Submit — sets all touched to true, shows email error
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /transmit/i }))
    })
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.some((el) => el.id === 'err-email')).toBe(true)
    })
  })

  it('shows message validation error after submitting with empty message', async () => {
    render(<ContactDialog />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } })
    // Leave message empty, submit
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /transmit/i }))
    })
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.some((el) => el.id === 'err-message')).toBe(true)
    })
  })

  // --- Submit button state --------------------------------------------------

  it('submit button is not disabled when form is valid', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response)
    render(<ContactDialog />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    const submitBtn = screen.getByRole('button', { name: /transmit/i })
    expect(submitBtn).not.toBeDisabled()
  })

  // --- Successful submit ----------------------------------------------------

  it('calls fetch with correct body and shows success state on OK response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response)

    render(<ContactDialog />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /transmit/i }))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello' }),
        }),
      )
    })

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining("I'll be in touch"),
      expect.any(Object),
    )
  })

  // --- Failed submit (non-ok) -----------------------------------------------

  it('shows error state and calls toast.error on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)

    render(<ContactDialog />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bob' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hi' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /transmit/i }))
    })

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(
        alerts.some((el) => el.textContent?.toLowerCase().includes('transmission failed')),
      ).toBe(true)
    })

    expect(toast.error).toHaveBeenCalled()
  })

  // --- Network error --------------------------------------------------------

  it('shows error state and calls toast.error on network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<ContactDialog />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Carol' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'carol@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hey' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /transmit/i }))
    })

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(
        alerts.some((el) => el.textContent?.toLowerCase().includes('transmission failed')),
      ).toBe(true)
    })

    expect(toast.error).toHaveBeenCalled()
  })

  // --- Escape key -----------------------------------------------------------

  it('calls closeContact when Escape key is pressed while dialog is open', async () => {
    render(<ContactDialog />)
    // Dialog is open; the keydown listener is attached by the useEffect
    fireEvent.keyDown(document, { key: 'Escape' })
    // Wait a tick for the event to propagate
    await waitFor(() => {
      expect(mockCloseContact).toHaveBeenCalled()
    })
  })

  // --- Close button ---------------------------------------------------------

  it('calls closeContact when the close button is clicked', () => {
    render(<ContactDialog />)
    const closeBtn = screen.getByLabelText(/close contact form/i)
    fireEvent.click(closeBtn)
    expect(mockCloseContact).toHaveBeenCalled()
  })

  // --- Reset on close -------------------------------------------------------

  it('resets form fields when dialog closes (form is not rendered when closed)', () => {
    // When isOpen = false, no form is rendered at all
    mockIsOpen = false
    render(<ContactDialog />)
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/message/i)).not.toBeInTheDocument()
  })
})
