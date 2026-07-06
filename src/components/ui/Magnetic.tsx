'use client'
import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const PULL = 0.25   // fraction of cursor offset applied
const MAX = 12      // px clamp

export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })

  if (prefersReducedMotion) return <>{children}</>

  function onMove(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(Math.max(-MAX, Math.min(MAX, dx * PULL)))
    y.set(Math.max(-MAX, Math.min(MAX, dy * PULL)))
  }
  function onLeave() { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-flex"
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  )
}
