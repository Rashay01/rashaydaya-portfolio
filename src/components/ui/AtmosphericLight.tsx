'use client'

import { useScroll, useTransform, useMotionTemplate, motion, useReducedMotion } from 'framer-motion'

const SCROLL_STOPS = [0, 0.25, 0.6, 0.85, 1] as const
const X_STOPS = [28, 32, 55, 58, 60]
const Y_STOPS = [45, 25, 20, 10, 5]
const OPACITY_STOPS = [0.12, 0.08, 0.05, 0.025, 0]

export function AtmosphericLight() {
  const { scrollYProgress } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  const x = useTransform(scrollYProgress, [...SCROLL_STOPS], X_STOPS)
  const y = useTransform(scrollYProgress, [...SCROLL_STOPS], Y_STOPS)
  const opacity = useTransform(scrollYProgress, [...SCROLL_STOPS], OPACITY_STOPS)
  const bg = useMotionTemplate`radial-gradient(ellipse 1000px 800px at ${x}% ${y}%, rgba(74,222,128,${opacity}) 0%, transparent 65%)`

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 1000px 800px at 28% 45%, rgba(74,222,128,0.10) 0%, transparent 65%)' }}
      />
    )
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: bg }}
    />
  )
}
