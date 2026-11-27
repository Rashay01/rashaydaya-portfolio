import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NoteText } from './NoteText'

describe('NoteText', () => {
  it('renders plain text unchanged', () => {
    const { container } = render(<p><NoteText text="No links here." /></p>)
    expect(container.textContent).toBe('No links here.')
    expect(container.querySelector('a')).toBeNull()
  })

  it('turns an external markdown link into a followed, new-tab anchor', () => {
    const { container } = render(
      <p><NoteText text="Built for [The House of Chai](https://thehouseofchai.co.za/) in Johannesburg." /></p>,
    )
    const link = screen.getByRole('link', { name: 'The House of Chai' })
    expect(link).toHaveAttribute('href', 'https://thehouseofchai.co.za/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(container.textContent).toBe('Built for The House of Chai in Johannesburg.')
  })

  it('keeps internal links in the same tab', () => {
    render(<p><NoteText text="Read [the case study](/projects/house-of-chai) and [notes](/notes)." /></p>)
    const link = screen.getByRole('link', { name: 'the case study' })
    expect(link).toHaveAttribute('href', '/projects/house-of-chai')
    expect(link).not.toHaveAttribute('target')
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
