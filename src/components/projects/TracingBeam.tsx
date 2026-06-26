'use client'

// Adapted from Aceternity UI's Tracing Beam
// (https://ui.aceternity.com/components/tracing-beam), copy-in component, not
// an npm dependency. Simplified from the upstream SVG-path version to a
// straight track, since this site's case study sections are a single linear
// column. Uses satin (not filament) for the fill: filament is reserved for
// actions, this is a passive scroll-progress indicator.
import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export function TracingBeam({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 15%', 'end 85%'] })
  const smoothed = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 })
  const height = useTransform(smoothed, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`)

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-ash/25 sm:block">
        <motion.div
          className="absolute left-0 top-0 w-px bg-satin shadow-[0_0_8px_2px_rgba(226,232,240,0.45)]"
          style={{ height }}
        />
      </div>
      {children}
    </div>
  )
}
