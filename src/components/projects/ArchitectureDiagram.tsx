import type { CaseStudy } from '@/lib/data/case-studies'
import { buildMermaidFlowchart } from '@/lib/data/case-studies'
import { MermaidDiagram } from './MermaidDiagram'

type Props = { architecture: CaseStudy['architecture'] }

export function ArchitectureDiagram({ architecture }: Props) {
  const titleId = 'architecture-title-' + architecture.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <figure className="rounded-sm border border-ash/15 bg-card p-5 sm:p-8">
      <div role="img" aria-labelledby={titleId} className="rounded-sm bg-obsidian/60 p-4">
        <MermaidDiagram definition={buildMermaidFlowchart(architecture)} />
      </div>
      <figcaption className="mt-6">
        <h3 id={titleId} className="sr-only">
          {architecture.title}
        </h3>
        <p className="text-ash leading-relaxed">{architecture.description}</p>
        <ol className="mt-5 grid gap-3 md:grid-cols-2" aria-label="Architecture flow">
          {architecture.nodes.map((node, index) => (
            <li key={node.id} className="border-l border-filament/50 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-filament">
                {String(index + 1).padStart(2, '0')} {node.label}
              </p>
              <p className="mt-1 text-sm text-satin/80">{node.detail}</p>
              {architecture.edges[index]?.label && (
                <p className="mt-2 text-xs text-ash">{architecture.edges[index].label}</p>
              )}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  )
}
