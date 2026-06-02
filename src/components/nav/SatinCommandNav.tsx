'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import { FilamentButton } from '@/components/ui/FilamentButton'
import { useContact } from '@/context/ContactContext'

const navLinks = [
  { href: '#archive', label: 'Archive' },
  { href: '#forge', label: 'Forge' },
  { href: '#deploy', label: 'Deploy' },
]

export function SatinCommandNav() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()

  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1))
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(href) },
        { rootMargin: '-20% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Focus trap for mobile nav dialog
  useEffect(() => {
    if (!mobileOpen) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = overlay.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return
      if (focusable.length === 0) { e.preventDefault(); return }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const close = useCallback(() => {
    setMobileOpen(false)
    // Return focus to hamburger after dialog closes
    requestAnimationFrame(() => hamburgerRef.current?.focus())
  }, [])

  const motionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, delay: 0.9, ease: 'easeOut' }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-4 bg-obsidian/80 backdrop-blur-md border-b border-ash/10"
        aria-label="Primary navigation"
      >
        <a
          href="#"
          className="logo-mark text-xs sm:text-sm md:text-base"
          aria-label="Rashay Daya — home"
          onClick={close}
        >
          RASHAY
        </a>

        {/* Desktop nav pills */}
        <ul className="hidden md:flex items-center gap-1 relative" role="list">
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <AnimatePresence>
                {hoveredLink === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ash/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </AnimatePresence>
              <a
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative z-10 px-4 py-2 min-h-[44px] text-sm font-medium transition-colors duration-200 flex items-center tracking-[-0.01em] ${
                  activeSection === link.href ? 'text-satin' : 'text-ash hover:text-satin'
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-filament"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <FilamentButton
            href="/Rashay_Daya_CV.pdf"
            download
            size="sm"
            aria-label="Download CV"
            onClick={() => toast('CV download started', {
              style: { borderColor: 'rgba(148,163,184,0.2)' },
            })}
          >
            <span className="hidden sm:inline">[ DOWNLOAD CV ]</span>
            <span className="sm:hidden">[ CV ]</span>
          </FilamentButton>

          {/* Hamburger — mobile only */}
          <button
            ref={hamburgerRef}
            className="md:hidden w-11 h-11 flex flex-col justify-center items-center gap-[5px] cursor-pointer rounded-sm border border-ash/10 hover:border-ash/25 transition-colors duration-200"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <motion.span
              className="block h-px w-4 bg-satin origin-center"
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
            />
            <motion.span
              className="block h-px w-4 bg-satin"
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
            />
            <motion.span
              className="block h-px w-4 bg-satin origin-center"
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={overlayRef}
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-40 md:hidden flex flex-col bg-obsidian/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-6 pt-16">
              <nav>
                <ul className="flex flex-col" role="list">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { delay: i * 0.07 + 0.05, duration: 0.28, ease: 'easeOut' }}
                    >
                      <a
                        href={link.href}
                        onClick={close}
                        className="flex items-center justify-between py-5 border-b border-ash/10 group cursor-pointer"
                      >
                        <span className="font-calsans text-3xl text-satin group-hover:text-filament transition-colors duration-200">
                          {link.label}
                        </span>
                        <span className="text-ash/30 group-hover:text-filament transition-colors duration-200 text-lg" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.28, duration: 0.25 }}
                className="mt-10"
              >
                <button
                  className="btn-filament w-full justify-center cursor-pointer"
                  onClick={() => { close(); openContact() }}
                >
                  GET IN TOUCH →
                </button>
              </motion.div>
            </div>

            <div className="px-6 pb-8 border-t border-ash/10 pt-4">
              <p className="font-mono text-[10px] text-ash/60 uppercase tracking-[0.1em]">
                © 2026 Rashay Daya
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
