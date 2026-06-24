'use client'

import { useMemo, useState } from 'react'
import type { CaseStudy } from '@/lib/data/case-studies'
import { buildSystemsMapFlowchart } from '@/lib/data/case-studies'
import { MermaidDiagram } from './MermaidDiagram'
import { DiagramZoomModal } from './DiagramZoomModal'

type Props = { caseStudies: CaseStudy[] }

const ALL = 'All'

// Reads ?tech= once on mount (e.g. from the command palette's "show
// terraform" command) rather than subscribing via useSearchParams, so this
// component doesn't need a Suspense boundary just to read an initial filter.
function initialTechFromUrl(): string {
  if (typeof window === 'undefined') return ALL
  return new URLSearchParams(window.location.search).get('tech') ?? ALL
}

export function ProjectsView({ caseStudies }: Props) {
  const [view, setView] = useState<'list' | 'systems-map'>('list')
  const [isExpanded, setIsExpanded] = useState(false)
  const [tech, setTech] = useState(initialTechFromUrl)
  const definition = buildSystemsMapFlowchart()

  const technologies = useMemo(() => {
    const set = new Set<string>()
    for (const study of caseStudies) {
      for (const item of study.stack ?? []) set.add(item)
    }
    return [ALL, ...Array.from(set).sort()]
  }, [caseStudies])

  const visibleCaseStudies =
    tech === ALL ? caseStudies : caseStudies.filter((study) => study.stack?.includes(tech))

  return (
    <div>
      <div role="group" aria-label="Filter by technology" className="mt-12 flex flex-wrap gap-2">
        {technologies.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTech(item)}
            aria-pressed={tech === item}
            className={
              'min-h-11 rounded-full border px-3 font-mono text-xs uppercase tracking-wide ' +
              (tech === item
                ? 'border-filament bg-filament text-obsidian'
                : 'border-ash/20 text-ash hover:border-filament hover:text-filament')
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div role="group" aria-label="Projects view" className="mt-6 inline-flex rounded-sm border border-ash/15">
        <button
          type="button"
          onClick={() => setView('list')}
          aria-pressed={view === 'list'}
          className={
            'min-h-11 px-4 font-mono text-xs uppercase tracking-widest ' +
            (view === 'list' ? 'bg-filament text-obsidian' : 'text-ash hover:text-filament')
          }
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setView('systems-map')}
          aria-pressed={view === 'systems-map'}
          className={
            'min-h-11 px-4 font-mono text-xs uppercase tracking-widest ' +
            (view === 'systems-map' ? 'bg-filament text-obsidian' : 'text-ash hover:text-filament')
          }
        >
          Systems Map
        </button>
      </div>

      {view === 'list' ? (
        <ol className="mt-8 grid gap-px overflow-hidden rounded-sm border border-ash/10 bg-ash/10 sm:grid-cols-2">
          {visibleCaseStudies.map((study, index) => (
            <li key={study.slug} className="bg-card p-6 sm:p-8">
              <a href={`/projects/${study.slug}`} className="block">
                <p
                  className={`font-mono text-xs uppercase tracking-wide ${
                    study.status === 'In progress' ? 'text-ash' : 'text-filament'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')} / {study.status}
                </p>
                <h2 className="mt-7 font-calsans text-2xl text-satin">{study.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ash">{study.summary}</p>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <figure className="mt-8 rounded-sm border border-ash/15 bg-card p-5 sm:p-8">
          <div className="relative rounded-sm bg-obsidian/60 p-4">
            <div role="img" aria-label="Cross-project systems map">
              <MermaidDiagram definition={definition} />
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="absolute right-2 top-2 inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-ash/15 bg-card px-3 font-mono text-[10px] uppercase tracking-widest text-ash hover:border-filament/60 hover:text-filament"
            >
              Expand ⤢
            </button>
          </div>
          {isExpanded && (
            <DiagramZoomModal title="Systems map" definition={definition} onClose={() => setIsExpanded(false)} />
          )}
          <figcaption className="mt-6 text-sm text-ash">
            Which case studies share infrastructure: Terraform module reuse, the security action&apos;s scan
            targets, and what the monitoring dashboard watches in production. Click a node to open its case study.
          </figcaption>
        </figure>
      )}
    </div>
  )
}
