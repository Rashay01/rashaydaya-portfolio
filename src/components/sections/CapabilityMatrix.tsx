'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { skillCategories } from '@/lib/data/skills'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SkillCell } from '@/components/ui/SkillCell'
import type { PipelineRun } from '@/lib/data/live-pipeline'
import { formatRelativeTime } from '@/lib/format-relative-time'

const SPAN_CLASSES = {
  hero: 'lg:col-span-4 lg:row-span-2',
  wide: 'lg:col-span-2 lg:row-span-2',
  standard: 'lg:col-span-2',
} as const

/**
 * Replaces ArchiveGrid, SystemCapabilities, and ProofOfWork. Those three
 * sections repeated the same tools/delivery/infra claims with no links;
 * this one keeps the real skill data and ties every category to the
 * project case study that actually proves it.
 */
export function CapabilityMatrix({ livePipeline = null }: { livePipeline?: PipelineRun | null }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="archive"
      ref={ref}
      className="border-t border-ash/10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10"
      aria-labelledby="archive-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
      >
        <SectionHeader
          title="The Archive."
          description="Tools and systems used to ship, automate, and operate production software. Every category links to the project that proves it."
          headingId="archive-heading"
        />
      </motion.div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-px bg-ash/10 border border-ash/10 rounded-sm overflow-hidden"
        role="list"
        aria-label="Technical skill categories"
      >
        {skillCategories.map((category, catIdx) => {
          const isCicd = category.header === 'CI/CD and Automation'
          const stat = isCicd && livePipeline
            ? {
                value: livePipeline.conclusion === 'success' ? 'PASSING' : 'CHECK',
                label: `LATEST PIPELINE, ${formatRelativeTime(livePipeline.updatedAt)}`,
              }
            : category.stat

          return (
            <motion.div
              key={category.header}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: catIdx * 0.1, ease: 'easeOut' }}
              role="listitem"
              className={`flex flex-col bg-obsidian p-6 sm:p-7 ${SPAN_CLASSES[category.span]}`}
            >
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <span className="font-mono text-[10px] text-filament/60 tracking-[0.04em] flex-shrink-0 w-5 text-center" aria-hidden="true">
                  {String(catIdx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-calsans font-semibold text-satin text-lg sm:text-xl tracking-[-0.02em]">
                  {category.header}
                </h3>
              </div>

              <ul className="flex flex-col gap-2" role="list">
                {category.skills.map((skill, skillIdx) => (
                  <motion.li
                    key={skill.name}
                    initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={prefersReducedMotion ? { duration: 0 } : {
                      duration: 0.35,
                      delay: catIdx * 0.1 + skillIdx * 0.04,
                      ease: 'easeOut',
                    }}
                  >
                    <SkillCell name={skill.name} tag={skill.tag} />
                  </motion.li>
                ))}
              </ul>

              <Link
                href={category.proof.href}
                className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ash/85 transition-colors duration-200 hover:text-filament"
              >
                Proof: {category.proof.label}
                <span aria-hidden="true">&rarr;</span>
              </Link>

              {isCicd && livePipeline ? (
                <a
                  href={livePipeline.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-6 block"
                >
                  <p className="font-calsans font-semibold text-satin text-4xl lg:text-5xl tracking-[-0.03em] leading-none">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash mt-2">
                    {stat.label}
                  </p>
                </a>
              ) : (
                <div className="mt-auto pt-6">
                  <p className="font-calsans font-semibold text-satin text-4xl lg:text-5xl tracking-[-0.03em] leading-none">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash mt-2">
                    {stat.label}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
