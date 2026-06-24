'use client'

// Adapted from Magic UI's Border Beam (https://magicui.design/docs/components/border-beam)
// — copy-in component, not an npm dependency. Re-pointed from `motion/react`
// to the `framer-motion` already installed in this repo, and rewritten the
// masking/gradient utility classes as plain CSS: the upstream source uses
// Tailwind v4-only utilities (`mask-intersect`, `bg-linear-to-l`,
// `border-(length:--x)`) that don't exist in this repo's Tailwind v3.4.
import { motion, type MotionStyle, type Transition } from 'framer-motion'

type BorderBeamProps = {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  transition?: Transition
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}

export function BorderBeam({
  size = 80,
  delay = 0,
  duration = 8,
  colorFrom = '#FF5F1F',
  colorTo = '#2D3E33',
  transition,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      style={
        {
          padding: borderWidth,
          WebkitMaskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
          WebkitMaskClip: 'content-box, border-box',
          WebkitMaskComposite: 'xor',
          maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
          maskClip: 'content-box, border-box',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
    >
      <motion.div
        className="absolute aspect-square"
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  )
}
