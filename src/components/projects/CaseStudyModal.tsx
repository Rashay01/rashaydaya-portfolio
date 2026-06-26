'use client'

import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { useDialogBehavior } from '@/lib/hooks/useDialogBehavior'
import { MonoLabel } from '@/components/ui/MonoLabel'
import type { CaseStudy } from '@/lib/data/case-studies'
import { CaseStudyContent } from './CaseStudyContent'

export function CaseStudyModal({ study }: { study: CaseStudy }) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const close = () => router.back()
  const overlayRef = useDialogBehavior(true, close)

  const motionProps = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.35, ease: 'easeOut' } }

  return (
    <motion.div
      ref={overlayRef}
      {...motionProps}
      className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-4 border-b border-ash/10">
        <MonoLabel size="xs">CASE STUDY</MonoLabel>
        <button
          type="button"
          onClick={close}
          className="w-11 h-11 flex items-center justify-center rounded-sm border border-ash/10 hover:border-ash/25 text-satin transition-colors duration-200 cursor-pointer font-mono text-sm"
          aria-label="Close case study"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12">
        <div id="case-study-modal-title" className="sr-only">
          {study.title}
        </div>
        <article className="mx-auto max-w-4xl">
          <CaseStudyContent study={study} />
        </article>
      </div>
    </motion.div>
  )
}
