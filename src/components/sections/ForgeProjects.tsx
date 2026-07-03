'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { projects } from '@/lib/data/projects'
import type { PipelineRun } from '@/lib/data/live-pipeline'
import type { CommitActivity } from '@/lib/data/github-activity'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'

export function ForgeProjects({
  livePipeline,
  recentActivity,
}: {
  livePipeline: PipelineRun | null
  recentActivity: CommitActivity[]
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  const featured = projects.find((p) => p.size === 'featured')
  const medium = projects.filter((p) => p.size === 'medium')
  const small = projects.filter((p) => p.size === 'small')

  const ease = [0.16, 1, 0.3, 1] as const

  function revealProps(delay: number) {
    if (prefersReducedMotion) return { initial: {}, animate: {}, transition: { duration: 0 } }
    return {
      initial: { opacity: 0, y: 16 },
      animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
      transition: { duration: 0.6, ease, delay },
    }
  }

  return (
    <section
      id="forge"
      ref={ref}
      className="relative border-t border-ash/10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 overflow-hidden"
      aria-labelledby="forge-heading"
    >
      <motion.div {...revealProps(0)}>
        <SectionHeader
          eyebrow="PRODUCTION SYSTEMS"
          title="The Forge."
          description="Production systems built with a focus on reliability, performance, and maintainability. From infrastructure and APIs to full-stack applications, each system is designed for real-world use."
          headingId="forge-heading"
          actions={
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-wider text-filament hover:underline"
            >
              View all case studies ↗
            </Link>
          }
        />
      </motion.div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
        {/* Featured card — resolves first, hero shot of the section */}
        {featured && (
          <motion.div
            className="sm:col-span-2 md:col-span-7"
            {...revealProps(0)}
          >
            <ProjectCard project={featured} featured />
          </motion.div>
        )}

        {/* Live pipeline readout */}
        <motion.div
          className="sm:col-span-2 md:col-span-5"
          {...revealProps(0.12)}
        >
          <LivePipelineCard pipeline={livePipeline} recentActivity={recentActivity} />
        </motion.div>

        {/* Medium cards — stagger as a group */}
        {medium.map((project, i) => (
          <motion.div
            key={project.id}
            className="sm:col-span-1 md:col-span-6"
            {...revealProps(0.15 + i * 0.12)}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}

        {/* Small cards — stagger behind medium group */}
        {small.map((project, i) => (
          <motion.div
            key={project.id}
            className="sm:col-span-1 md:col-span-4"
            {...revealProps(0.30 + i * 0.12)}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}

        {/* GitHub CTA card */}
        <motion.div
          className="sm:col-span-1 md:col-span-8"
          {...revealProps(0.42)}
        >
          <GitHubCTACard />
        </motion.div>
      </div>
    </section>
  )
}

const JOB_GLYPH: Record<string, string> = {
  success: '✓',
  failure: '✗',
  cancelled: '–',
}

function LivePipelineCard({
  pipeline,
  recentActivity,
}: {
  pipeline: PipelineRun | null
  recentActivity: CommitActivity[]
}) {
  return (
    <article
      className="h-full rounded-sm border border-avocatus/30 bg-card-deep p-5 sm:p-6 flex flex-col min-h-[340px] sm:min-h-[420px]"
      aria-label="Vanguard Pipeline: live CI/CD readout"
    >
      <p className="text-ash/85 text-[13px] sm:text-sm leading-[1.55] mb-4 sm:mb-6">
        Live GitHub Actions status for this portfolio&apos;s own CI pipeline: lint, unit tests, and E2E tests.
      </p>

      <div className="flex-1 rounded-sm bg-obsidian/80 p-3 sm:p-4 overflow-hidden font-mono text-[11px] sm:text-xs">
        {pipeline ? (
          <>
            <p className="mb-3 uppercase tracking-[0.08em] text-ash/85">
              VANGUARD PIPELINE <span className="text-live">{pipeline.conclusion ?? pipeline.status}</span>
            </p>
            <ul className="space-y-1.5">
              {pipeline.jobs.map((job) => (
                <li key={job.name} className="flex items-center gap-2 text-ash">
                  <span aria-hidden="true">{JOB_GLYPH[job.conclusion ?? ''] ?? '…'}</span>
                  {job.name}
                  {job.name === 'Unit Tests' && pipeline.testSummary && (
                    <span className="text-ash/70">({pipeline.testSummary})</span>
                  )}
                </li>
              ))}
            </ul>
            <a
              href={pipeline.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center text-filament hover:underline"
            >
              View run on GitHub ↗
            </a>
          </>
        ) : (
          <p className="text-ash">
            &gt; ERR: live status unavailable.{' '}
            <a
              href="https://github.com/Rashay01/rashaydaya-portfolio/actions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-filament hover:underline"
            >
              View workflow runs on GitHub ↗
            </a>
          </p>
        )}
      </div>

      {recentActivity.length > 0 && (
        <ul className="mt-4 space-y-1.5 font-mono text-[11px] text-ash">
          {recentActivity.map((commit) => (
            <li key={commit.sha} className="truncate">
              <a href={commit.htmlUrl} target="_blank" rel="noopener noreferrer" className="hover:text-satin">
                <span className="text-ash/60">{commit.sha}</span> {commit.message}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function GitHubCTACard() {
  return (
    <a
      href="https://github.com/Rashay01"
      target="_blank"
      rel="noopener noreferrer"
      className="h-full min-h-[180px] rounded-sm border border-ash/[0.08] bg-card hover:border-ash/20 hover:bg-card-hover transition-colors duration-200 p-5 sm:p-6 flex flex-col justify-between group cursor-pointer"
      aria-label="View more projects on GitHub"
    >
      <div>
        <p className="font-calsans text-satin text-lg sm:text-xl tracking-[-0.02em] leading-tight">
          View all projects
          <br />
          on GitHub
        </p>
      </div>
      <p className="font-mono text-[10px] text-ash/85 uppercase tracking-[0.08em] group-hover:text-satin transition-colors duration-200 mt-4">
        github.com/Rashay01
      </p>
    </a>
  )
}
