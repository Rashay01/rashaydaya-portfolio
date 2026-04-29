'use client'

import { useState } from 'react'
import type { ProjectData } from '@/lib/data/projects'
import { MonoLabel } from './MonoLabel'
import { TechPill } from './TechPill'
import { Metric } from './Metric'
import { TerminalPanel } from './TerminalPanel'

type ProjectCardProps = {
  project: ProjectData
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  const minHeight = featured ? 'min-h-[340px] sm:min-h-[420px]' : 'min-h-[260px] sm:min-h-[300px]'

  return (
    <article
      className={`relative overflow-hidden rounded-sm border border-ash/10 bg-card group ${minHeight} flex flex-col`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-card link overlay for projects with a live URL */}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-filament focus-visible:ring-inset rounded-sm"
          aria-label={`View ${project.title} live site`}
        />
      )}

      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(45,62,51,0.18) 0%, transparent 70%)',
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

      <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <MonoLabel size="xs" tone="muted" className="mb-1 block">
              {project.codename}
            </MonoLabel>
            <h3 className="font-calsans font-semibold text-satin text-lg sm:text-xl leading-tight tracking-[-0.02em]">
              {project.title}
            </h3>
          </div>
          {/* Status badge + live link */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" aria-hidden="true" />
              <span className="font-mono text-[9px] text-live uppercase tracking-[0.08em]">
                {project.terminal.status}
              </span>
            </div>
            {project.liveUrl && (
              <span className="font-mono text-[9px] text-ash/60 group-hover:text-filament uppercase tracking-[0.08em] transition-colors duration-200" aria-hidden="true">
                VIEW LIVE →
              </span>
            )}
          </div>
        </div>

        <p className="text-ash text-[13px] sm:text-sm leading-[1.55] tracking-[-0.01em] mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {project.techStack.map((tech) => (
            <TechPill key={tech} label={tech} />
          ))}
        </div>

        {/* Headline metric */}
        <div className="mt-auto flex items-end justify-between gap-4">
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

        {/* Mobile stats — always visible, terminal-style */}
        <div className="md:hidden mt-4 pt-4 border-t border-ash/10 flex gap-4 flex-wrap">
          {project.terminal.stats.slice(0, 2).map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.08em] mb-0.5">{stat.label}</p>
              <p className="font-mono text-[11px] text-ash">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal hover panel — desktop only. z-20 ensures it renders above card content (z-10) */}
      <div
        className={`hidden md:block absolute inset-x-0 bottom-0 h-[55%] pointer-events-none z-20 transition-transform ease-out ${
          hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        aria-hidden="true"
        style={{ transitionDuration: '400ms' }}
      >
        <div className="h-full p-4 bg-obsidian/[0.94] backdrop-blur-md border-t border-avocatus/50">
          <TerminalPanel
            label={project.terminal.label}
            status={project.terminal.status}
            lines={project.terminal.lines.slice(0, 4)}
            stats={project.terminal.stats.slice(0, 2)}
            compact
          />
        </div>
      </div>
    </article>
  )
}
