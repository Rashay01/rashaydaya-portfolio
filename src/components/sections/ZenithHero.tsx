'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MonolithSkeleton } from '@/components/three/MonolithSkeleton'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { FilamentButton } from '@/components/ui/FilamentButton'
import { useContact } from '@/context/ContactContext'

const MonolithScene = dynamic(() => import('@/components/three/MonolithScene'), {
  ssr: false,
  loading: () => <MonolithSkeleton />,
})

export function ZenithHero({ cvUpdatedLabel }: { cvUpdatedLabel: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [entered, setEntered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 0)
    return () => clearTimeout(t)
  }, [])

  // Blur-dissolve for name words — film title materialise
  function wordProps(delayMs: number) {
    if (prefersReducedMotion) return {}
    return {
      initial: { opacity: 0, filter: 'blur(8px)' },
      animate: entered ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' },
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: delayMs / 1000 },
    }
  }

  // Plain opacity fade for secondary elements
  function fadeProps(delayMs: number) {
    if (prefersReducedMotion) return {}
    return {
      initial: { opacity: 0 },
      animate: entered ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: delayMs / 1000 },
    }
  }

  return (
    <section
      id="zenith"
      className="relative min-h-[100dvh] bg-obsidian overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* SR-only for WebGL blindspot + SEO entity understanding */}
      <div className="sr-only">
        <p>
          Rashay Daya. DevOps Engineer and Full Stack Builder based in Cape Town.
          Building production systems from infrastructure to interface.
          Focused on cloud, platform engineering, and full-stack delivery.
        </p>
      </div>

      {/* Artifact glow — one light source, bleeds toward section below */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 900px 800px at 28% 55%, rgba(74,222,128,0.055) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-20 pb-16 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-10 md:min-h-[calc(100dvh-10rem)] md:items-center">

          {/* Left column — artifact as gravitational centre */}
          <div className="order-2 md:order-1 md:col-span-5 flex flex-col items-center justify-center">

            {/* Desktop: large artifact fills column */}
            <motion.div
              className="hidden md:flex items-center justify-center w-full relative"
              style={{ height: 'clamp(320px, 55vh, 560px)' }}
              animate={prefersReducedMotion ? {} : { scale: [1, 1.015, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              {isDesktop && <MonolithScene />}
            </motion.div>

            {/* Mobile fallback — location/status indicator */}
            <div
              className="block md:hidden border border-avocatus/25 bg-avocatus/5 p-5 rounded-sm relative overflow-hidden w-full"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 100%, rgba(90,138,110,0.25), transparent 70%)',
                }}
              />
              <div className="relative font-mono text-[10px] text-ash leading-[1.8] tracking-[0.08em] uppercase">
                <span className="text-ash/80">CAPE TOWN, SOUTH AFRICA</span>
                <br />
                <span className="text-live">STATUS: LIVE</span>
              </div>
            </div>
          </div>

          {/* Right column — name + content */}
          <div className="order-1 md:order-2 md:col-span-7 flex flex-col gap-4 md:gap-5">

            {/* h1 — LCP element, film title entrance */}
            <h1
              id="hero-heading"
              className="font-calsans font-semibold text-satin leading-[0.92] tracking-[-0.03em] text-[clamp(3rem,14vw,6rem)] md:text-[clamp(3.5rem,8vw,7rem)]"
            >
              <motion.span className="block" {...wordProps(0)}>Rashay</motion.span>
              <motion.span className="block" {...wordProps(200)}>Daya</motion.span>
            </h1>

            <motion.div {...fadeProps(600)}>
              <MonoLabel size="sm" className="tracking-[0.12em]">
                DEVOPS ENGINEER &amp; FULL STACK BUILDER
              </MonoLabel>
            </motion.div>

            <motion.p
              {...fadeProps(700)}
              className="text-satin/90 text-[15px] sm:text-base leading-[1.6] tracking-[-0.01em] max-w-[430px]"
            >
              Designing, building, and deploying production-ready systems across cloud
              infrastructure, APIs, automation, and modern web interfaces.
            </motion.p>

            {/* sr-only entity paragraph for search crawlers */}
            <p className="sr-only">
              Rashay Daya is a DevOps Engineer and Full Stack Developer based in
              Cape Town, Western Cape, South Africa. He designs and ships production systems
              using AWS, Terraform, Cloudflare, GitHub Actions, React, Next.js,
              Node.js, Python and Java.
            </p>

            <motion.div {...fadeProps(850)} className="flex flex-col xs:flex-row flex-wrap gap-3">
              <FilamentButton href="#forge">View Projects</FilamentButton>
              <FilamentButton as="button" onClick={openContact}>Contact Me</FilamentButton>
            </motion.div>

            <motion.div
              {...fadeProps(1000)}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em]"
            >
              <span className="text-signal">CV updated: {cvUpdatedLabel}</span>
              <a
                className="inline-flex min-h-11 items-center text-ash hover:text-satin"
                href="https://github.com/Rashay01"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
              <a
                className="inline-flex min-h-11 items-center text-ash hover:text-satin"
                href="https://za.linkedin.com/in/rashay-daya-795804262"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  )
}
