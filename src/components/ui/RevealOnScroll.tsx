'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE_OUT_EXPO, DUR_BASE } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

type Props = {
  children: ReactNode
  delay?: number
  className?: string
}

export function RevealOnScroll({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={prefersReducedMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: DUR_BASE, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  )
}
