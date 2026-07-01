'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Link from 'next/link'
import type { CaseStudy } from '@/lib/data/case-studies'
import { buildSystemsMapFlowchart } from '@/lib/data/case-studies'
import { useDialogBehavior } from '@/lib/hooks/useDialogBehavior'
import { MermaidDiagram } from './MermaidDiagram'
import { DiagramZoomModal } from './DiagramZoomModal'

type Props = { caseStudies: CaseStudy[] }

const ALL = 'All'

function initialTechFromUrl(): string {
  if (typeof window === 'undefined') return ALL
  return new URLSearchParams(window.location.search).get('tech') ?? ALL
}

export function ProjectsView({ caseStudies }: Props) {
  const [view, setView] = useState<'list' | 'systems-map'>('list')
  const [isExpanded, setIsExpanded] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
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
      <div className="mt-12 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-ash/20 px-4 font-mono text-xs uppercase tracking-wide text-ash transition-colors duration-200 hover:border-filament hover:text-filament"
        >
          Filter
          {tech !== ALL && (
            <span className="rounded-full bg-filament px-2 py-0.5 font-mono text-[10px] text-obsidian">
              {tech}
            </span>
          )}
        </button>

        {tech !== ALL && (
          <button
            type="button"
            onClick={() => setTech(ALL)}
            className="font-mono text-xs uppercase tracking-wide text-ash/50 transition-colors duration-200 hover:text-ash"
          >
            Clear
          </button>
        )}

        <ViewToggle view={view} onChange={setView} />
      </div>

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        technologies={technologies}
        activeTech={tech}
        onSelect={setTech}
      />

      {view === 'list' ? (
        <ol className="mt-8 grid gap-px overflow-hidden rounded-sm border border-ash/10 bg-ash/10 sm:grid-cols-2">
          {visibleCaseStudies.map((study, index) => (
            <li key={study.slug} className="bg-card p-6 sm:p-8">
              <Link href={`/projects/${study.slug}`} className="block">
                <p
                  className={`font-mono text-xs uppercase tracking-wide ${
                    study.status === 'In progress' ? 'text-ash' : 'text-filament'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')} / {study.status}
                </p>
                <h2 className="mt-7 font-calsans text-2xl text-satin">{study.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ash">{study.summary}</p>
              </Link>
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

const VIEW_OPTIONS = [
  { value: 'list' as const, label: 'List' },
  { value: 'systems-map' as const, label: 'Systems Map' },
] as const

function ViewToggle({
  view,
  onChange,
}: {
  view: 'list' | 'systems-map'
  onChange: (v: 'list' | 'systems-map') => void
}) {
  const hasInteracted = useRef(false)

  // Auto-showcase the slide once on mount so users discover the interaction
  useEffect(() => {
    const t1 = setTimeout(() => { if (!hasInteracted.current) onChange('systems-map') }, 900)
    const t2 = setTimeout(() => { if (!hasInteracted.current) onChange('list') }, 1700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  // ponytail: onChange is stable (setView), intentionally mount-only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LayoutGroup>
      <div role="group" aria-label="Projects view" className="inline-flex rounded-sm border border-ash/15">
        {VIEW_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => { hasInteracted.current = true; onChange(value) }}
            aria-pressed={view === value}
            className={`relative min-h-11 overflow-hidden px-4 font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
              view === value ? 'text-obsidian' : 'text-ash hover:text-filament'
            }`}
          >
            {view === value && (
              <motion.span
                layoutId="view-toggle-bg"
                className="absolute inset-0 bg-filament"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  )
}

function FilterDrawer({
  isOpen,
  onClose,
  technologies,
  activeTech,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  technologies: string[]
  activeTech: string
  onSelect: (tech: string) => void
}) {
  const drawerRef = useDialogBehavior(isOpen, onClose)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-obsidian/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter projects by technology"
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-ash/15 bg-card p-6 pb-10"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-ash/20" aria-hidden="true" />
            <div className="mb-6 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-ash">Filter by technology</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filter"
                className="flex min-h-11 min-w-11 items-center justify-center text-ash transition-colors hover:text-satin"
              >
                ✕
              </button>
            </div>
            <div className="flex max-h-[60vh] flex-wrap gap-2 overflow-y-auto">
              {technologies.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => { onSelect(item); onClose() }}
                  aria-pressed={activeTech === item}
                  className={
                    'min-h-11 rounded-full border px-4 font-mono text-xs uppercase tracking-wide transition-colors duration-200 ' +
                    (activeTech === item
                      ? 'border-filament bg-filament text-obsidian'
                      : 'border-ash/20 text-ash hover:border-filament hover:text-filament')
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
