'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { skillCategories } from '@/lib/data/skills'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SkillCell } from '@/components/ui/SkillCell'

export function ArchiveGrid() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="archive"
      ref={ref}
      className="bg-obsidian border-t border-ash/10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10"
      aria-labelledby="archive-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
      >
        <SectionHeader
          eyebrow="THE ARCHIVE"
          title="The Archive."
          description="Core technologies used to build and operate production systems. Focused on practical tools that support scalable and reliable solutions."
          headingId="archive-heading"
        />
      </motion.div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
        role="list"
        aria-label="Technical skill categories"
      >
        {skillCategories.map((category, catIdx) => (
          <motion.div
            key={category.header}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: catIdx * 0.1, ease: 'easeOut' }}
            role="listitem"
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
          </motion.div>
        ))}
      </div>
    </section>
  )
}
