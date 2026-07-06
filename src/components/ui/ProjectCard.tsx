'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import type { ProjectData } from '@/lib/data/projects'
import { MonoLabel } from './MonoLabel'
import { TechPill } from './TechPill'
import { Metric } from './Metric'
import { TerminalPanel } from './TerminalPanel'
import { BorderBeam } from './BorderBeam'

type ProjectCardProps = {
  project: ProjectData
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const [openCount, setOpenCount] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const router = useRouter()

  const primaryHref = project.caseStudySlug
    ? `/projects/${project.caseStudySlug}`
    : project.liveUrl ?? null

  const minHeight = featured ? 'min-h-[340px] sm:min-h-[420px]' : 'min-h-[260px] sm:min-h-[300px]'

  function handleCardClick() {
    if (!primaryHref) return
    if (primaryHref.startsWith('http')) {
      window.open(primaryHref, '_blank', 'noopener,noreferrer')
    } else {
      router.push(primaryHref)
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
  }

  return (
    <article
      className={`relative overflow-hidden rounded-sm border border-ash/10 bg-card group ${minHeight} flex flex-col ${primaryHref ? 'cursor-pointer' : ''}`}
      style={{
        borderTopColor: 'rgba(74, 222, 128, 0.12)',
        transform: hovered ? 'translateY(-2px)' : undefined,
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.4)' : undefined,
        transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
      }}
      onClick={handleCardClick}
      onKeyDown={primaryHref ? (e) => { if (e.key === 'Enter') handleCardClick() } : undefined}
      tabIndex={primaryHref ? 0 : undefined}
      role={primaryHref ? 'link' : undefined}
      onMouseEnter={() => { setHovered(true); setOpenCount(c => c + 1) }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
    >
      {featured && !prefersReducedMotion && <BorderBeam />}

      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(45,62,51,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Cursor spotlight, filament-tinted, tracks --spot-x/--spot-y from onMouseMove */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,95,31,0.07), transparent 65%)',
        }}
      />

      {featured && (
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(135deg, transparent 35%, rgba(255,95,31,0.06) 55%, transparent 75%)',
          }}
        />
      )}

      {/* Above the hover panel (z-20) so links stay clickable and visible, lifts in sync with the panel rising beneath it */}
      <div
        className={`relative z-30 pb-0 flex flex-col transition-transform ease-out ${
          featured ? 'p-8 sm:p-10' : 'p-5 sm:p-6'
        } ${hovered ? 'md:-translate-y-1' : ''}`}
        style={{ transitionDuration: '400ms' }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <MonoLabel size="xs" tone="muted" className="mb-1 block">
              {project.codename}
            </MonoLabel>
            <h3
              className="font-calsans font-semibold text-satin text-lg sm:text-xl leading-tight tracking-[-0.02em]"
              style={project.caseStudySlug ? { viewTransitionName: `project-title-${project.caseStudySlug}` } as React.CSSProperties : undefined}
            >
              {project.title}
            </h3>
          </div>
          {/* Status badge + live link */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="font-mono text-xs text-live uppercase tracking-wide">
                {project.terminal.status}
              </span>
            </div>
            {project.liveUrl && (
              <span className="font-mono text-[9px] text-ash/80 group-hover:text-filament uppercase tracking-[0.08em] transition-colors duration-200" aria-hidden="true">
                Live Site
              </span>
            )}
          </div>
        </div>

        <p className="text-ash/85 text-[13px] sm:text-sm leading-[1.55] tracking-[-0.01em] mb-4">
          {project.description}
        </p>

        <dl className="grid grid-cols-1 gap-1.5 border-y border-ash/10 py-3 mb-4 sm:grid-cols-3 sm:gap-3">
          <div>
            <dt className="font-mono text-[10px] text-ash uppercase tracking-wide">Ownership</dt>
            <dd className="font-mono text-xs text-satin uppercase tracking-wide">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] text-ash uppercase tracking-wide">Built</dt>
            <dd className="font-mono text-xs text-satin uppercase tracking-wide">{project.built}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] text-ash uppercase tracking-wide">Status</dt>
            <dd className="font-mono text-xs text-satin uppercase tracking-wide">{project.statusLabel}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {project.techStack.map((tech) => (
            <TechPill key={tech} label={tech} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.liveUrl && (
            <ProjectAction href={project.liveUrl} label="Live Site" />
          )}
          <ProjectMarker label="Code Private" />
          {project.caseStudySlug && (
            <ProjectAction href={`/projects/${project.caseStudySlug}`} label="Case Study" />
          )}
        </div>
      </div>

      {/* Remaining space below the buttons, the hover panel fills exactly this box, so it never reaches up under them. Floored so the full terminal readout has room to render without clipping. */}
      <div className={`relative flex-1 ${featured ? 'md:min-h-[280px]' : 'md:min-h-[230px]'}`}>
        <div className={`relative z-10 h-full flex flex-col justify-end pt-0 ${featured ? 'p-8 sm:p-10' : 'p-5 sm:p-6'}`}>
          {/* Headline metric */}
          <div className="flex items-end justify-between gap-4">
            <Metric
              label={project.metric.label}
              value={project.metric.value}
              size={featured ? 'lg' : 'md'}
            />
            {project.secondMetric && (
              <Metric
                label={project.secondMetric.label}
                value={project.secondMetric.value}
                size="md"
                align="right"
              />
            )}
          </div>

          {/* Mobile stats, always visible, terminal-style */}
          <div className="md:hidden mt-4 pt-4 border-t border-ash/10 flex gap-4 flex-wrap">
            {project.terminal.stats.slice(0, 2).map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-[9px] text-ash/85 uppercase tracking-[0.08em] mb-0.5">{stat.label}</p>
                <p className="font-mono text-[11px] text-ash">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal hover panel, desktop only. Fills this box exactly, so its top edge lines up with the bottom of the buttons above. */}
        <div
          className={`hidden md:block absolute inset-0 pointer-events-none z-20 transition-transform ease-out ${
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          aria-hidden="true"
          style={{ transitionDuration: '400ms' }}
        >
          <div className="h-full bg-obsidian border border-avocatus/50 rounded-t-lg overflow-hidden">
            <TerminalPanel
              label={project.terminal.label}
              status={project.terminal.status}
              lines={project.terminal.lines.slice(0, 4)}
              stats={project.terminal.stats.slice(0, 2)}
              compact
              animationKey={openCount}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectAction({ href, label }: { href?: string; label: string }) {
  const classes =
    'relative z-30 inline-flex min-h-[44px] items-center rounded-full border border-ash/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ash transition-colors duration-200 hover:border-filament hover:text-filament'

  if (!href) {
    return (
      <span className={classes} aria-label={label}>
        {label}
      </span>
    )
  }

  const external = href.startsWith('http')
  if (!external) {
    return (
      <Link href={href} className={classes} onClick={(e) => e.stopPropagation()}>
        {label}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={(e) => e.stopPropagation()}>
      {label}
    </a>
  )
}

function ProjectMarker({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-wide text-ash">
      {label}
    </span>
  )
}
