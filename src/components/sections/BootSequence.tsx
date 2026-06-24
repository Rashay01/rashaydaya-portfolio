'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const STORAGE_KEY = 'boot-sequence-seen'

const lines = [
  'RASHAY DAYA / PORTFOLIO v1.0',
  'INITIALIZING SYSTEM...',
  'LOADING MODULES: INFRA, API, INTERFACE...',
  'STATUS: READY',
]

export function BootSequence() {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [lineCount, setLineCount] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) || prefersReducedMotion) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
      return
    }

    const timers = lines.map((_, index) =>
      setTimeout(() => setLineCount(index + 1), index * 300),
    )
    const finish = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
    }, lines.length * 300 + 300)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finish)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!visible) return
    function skip(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
      }
    }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, '1')
            setVisible(false)
          }}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-obsidian font-mono text-xs uppercase tracking-[0.08em] text-ash"
        >
          <div>
            {lines.slice(0, lineCount).map((line, index) => (
              <p key={line} className={index === lines.length - 1 ? 'text-live' : undefined}>
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
