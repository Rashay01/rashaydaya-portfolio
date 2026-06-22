'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { FilamentButton } from '@/components/ui/FilamentButton'
import { useContact } from '@/context/ContactContext'

const socialLinks = [
  { label: 'GITHUB', href: 'https://github.com/Rashay01' },
  { label: 'LINKEDIN', href: 'https://za.linkedin.com/in/rashay-daya-795804262' },
  { label: 'EMAIL', href: 'mailto:rashay.jcdaya@gmail.com' },
]

export function SignatureFooter() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()


  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay, ease: [0, 0, 0.58, 1] },
  })

  return (
    <footer
      id="deploy"
      ref={ref}
      className="relative bg-obsidian border-t border-ash/10 overflow-hidden"
      aria-label="Contact and footer"
    >
      <div className="px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 relative">
        {/* Availability badge + status */}
        <motion.div
          {...fadeUp(0.1)}
          className="flex items-center gap-3 mb-8 sm:mb-10"
        >
          <span
            role="img"
            className="inline-block w-2 h-2 rounded-full bg-signal animate-pulse"
            style={{ boxShadow: '0 0 8px var(--signal-glow)' }}
            aria-label="Available for work"
          />
          <span className="font-mono text-[10px] sm:text-[11px] text-signal uppercase tracking-[0.12em]">
            Available for DevOps, cloud, platform, and full-stack roles.
          </span>
        </motion.div>

        {/* Main contact block */}
        <motion.div
          {...fadeUp(0.2)}
          className="mb-10 sm:mb-12 md:mb-16 max-w-xl"
        >
          <h2 className="font-calsans text-satin mb-4 sm:mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Infrastructure live.
          </h2>
          <p className="text-satin/85 text-[15px] sm:text-base leading-[1.6] tracking-[-0.01em] mb-6 sm:mb-8">
            Available for DevOps, cloud, platform, and full-stack opportunities.
          </p>
          <FilamentButton as="button" onClick={openContact} aria-label="Open contact form">
            <span>Start the conversation</span>
          </FilamentButton>
        </motion.div>
      </div>

      {/* DEPLOY. — edge-to-edge typographic finale */}
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full overflow-hidden"
        aria-hidden="true"
      >
        <div className="deploy-atmosphere" />
        <h2 className="deploy-text">
          DEPLOY.
        </h2>
      </motion.div>

      {/* Footer bar */}
      <div className="border-t border-ash/10 px-4 sm:px-6 md:px-10 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <a href="#" className="logo-mark text-xs" aria-label="Rashay Daya home">
          RASHAY
        </a>

        <nav aria-label="Social links">
          <ul className="flex items-center gap-2 sm:gap-4" role="list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center py-2 px-2 font-mono text-[10px] sm:text-[11px] text-ash hover:text-satin transition-colors duration-200 uppercase tracking-[0.1em] min-h-[44px]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-1">
          <p className="font-mono text-[10px] text-ash/90 uppercase tracking-[0.08em]">
            Based in South Africa. Working globally.
          </p>
          <p className="font-mono text-[10px] text-ash/80 uppercase tracking-[0.08em]">
            Innovation Award: 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
