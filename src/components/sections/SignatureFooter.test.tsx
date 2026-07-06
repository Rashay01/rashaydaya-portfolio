import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('framer-motion', () => import('@/test/mocks/framer-motion'))

vi.mock('@/context/ContactContext', () => ({
  useContact: () => ({
    isOpen: false,
    openContact: vi.fn(),
    closeContact: vi.fn(),
  }),
}))

import { SignatureFooter } from './SignatureFooter'

describe('SignatureFooter', () => {
  it('renders the mailto finale link', () => {
    render(<SignatureFooter />)
    expect(screen.getByRole('link', { name: /rashay\.jcdaya@gmail\.com/i })).toHaveAttribute(
      'href',
      'mailto:rashay.jcdaya@gmail.com',
    )
  })

  it('renders the DEPLOY text', () => {
    render(<SignatureFooter />)
    expect(screen.getByText('DEPLOY.')).toBeInTheDocument()
  })

  it('renders the availability badge', () => {
    render(<SignatureFooter />)
    expect(screen.getByText(/Available for DevOps/i)).toBeInTheDocument()
  })

  it('renders the social links', () => {
    render(<SignatureFooter />)
    expect(screen.getByRole('link', { name: 'GITHUB' })).toHaveAttribute(
      'href',
      'https://github.com/Rashay01',
    )
    expect(screen.getByRole('link', { name: 'LINKEDIN' })).toHaveAttribute(
      'href',
      'https://za.linkedin.com/in/rashay-daya-795804262',
    )
  })
})
