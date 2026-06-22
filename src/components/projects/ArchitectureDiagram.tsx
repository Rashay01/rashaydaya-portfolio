import type { CaseStudy } from '@/lib/data/case-studies'

type Props = { architecture: CaseStudy['architecture'] }

export function ArchitectureDiagram({ architecture }: Props) {
  return (
    <figure className="rounded-sm border border-ash/15 bg-card p-5 sm:p-8">
      <svg role="img" aria-labelledby="architecture-title architecture-description" viewBox="0 0 800 180" className="w-full h-auto">
        <title id="architecture-title">{architecture.title}</title><desc id="architecture-description">{architecture.description}</desc>
        <line x1="70" y1="90" x2="730" y2="90" stroke="rgba(255,95,31,.55)" strokeWidth="2" />
        {architecture.nodes.map((node, index) => { const x = 70 + (index * 660) / Math.max(architecture.nodes.length - 1, 1); return <g key={node.id}><circle cx={x} cy="90" r="24" fill="#111418" stroke="#94A3B8" /><circle cx={x} cy="90" r="5" fill="#FF5F1F" /></g> })}
      </svg>
      <figcaption className="mt-6"><p className="text-ash leading-relaxed">{architecture.description}</p>
        <ol className="mt-5 grid gap-3 md:grid-cols-2" aria-label="Architecture flow">{architecture.nodes.map((node, index) => <li key={node.id} className="border-l border-filament/50 pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-filament">{String(index + 1).padStart(2, '0')} {node.label}</p><p className="mt-1 text-sm text-satin/80">{node.detail}</p>{architecture.edges[index]?.label && <p className="mt-2 text-xs text-ash">{architecture.edges[index].label}</p>}</li>)}</ol>
      </figcaption>
    </figure>
  )
}
