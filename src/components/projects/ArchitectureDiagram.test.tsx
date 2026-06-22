import { render, screen } from '@testing-library/react'
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
})
