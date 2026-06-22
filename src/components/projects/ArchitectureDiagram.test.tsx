import { render, screen, fireEvent } from '@testing-library/react'
import { ArchitectureDiagram } from './ArchitectureDiagram'

const architecture = {
  title: 'Delivery flow',
  description: 'A tested delivery path.',
  nodes: [
    { id: 'source', label: 'Source', detail: 'Repository' },
    { id: 'deploy', label: 'Deploy', detail: 'Production' },
  ],
  edges: [{ from: 'source', to: 'deploy', label: 'verified build' }],
}

describe('ArchitectureDiagram', () => {
  it('provides an accessible diagram and a text fallback', () => {
    render(<ArchitectureDiagram architecture={architecture} />)
    expect(screen.getByRole('img', { name: /Delivery flow/ })).toBeInTheDocument()
    expect(screen.getByText(/Source/)).toBeInTheDocument()
    expect(screen.getByText('verified build')).toBeInTheDocument()
    expect(screen.getByText('Production')).toBeInTheDocument()
  })

  it('opens a zoomable modal when Expand is clicked', () => {
    render(<ArchitectureDiagram architecture={architecture} />)
    fireEvent.click(screen.getByRole('button', { name: /Expand/ }))

    const dialog = screen.getByRole('dialog', { name: /Delivery flow diagram, expanded/ })
    expect(dialog).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByText('125%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close diagram' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
