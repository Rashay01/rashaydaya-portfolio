'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { FilamentButton } from '@/components/ui/FilamentButton'
import { useContact } from '@/context/ContactContext'

const MonolithScene = dynamic(() => import('@/components/three/MonolithScene'), { ssr: false })

const systemStats = [
  { key: 'RELIABILITY', value: 'HIGH' },
  { key: 'UPTIME', value: '99.5%' },
  { key: 'DEPLOY TIME', value: '< 2 MIN' },
]

export function ZenithHero() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  const isXLScreen = useMediaQuery('(min-width: 1440px)')
  const [swept, setSwept] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()

  useEffect(() => {
    const t = setTimeout(() => setSwept(true), prefersReducedMotion ? 0 : 1200)
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  return (
    <section
      id="zenith"
      className="relative min-h-screen bg-obsidian overflow-hidden"
      aria-labelledby="hero-heading-sr"
    >
      {/* SR-only shadow content for WebGL blindspot + SEO */}
      <div className="sr-only">
        <p id="hero-heading-sr">
          Rashay Daya — DevOps Engineer &amp; Full Stack Builder.
          Building production systems from infrastructure to interface.
          System reliability high. Uptime 99.5%. Deployment time under 2 minutes.
        </p>
      </div>

      {!swept && <div className="sweep-line" aria-hidden="true" />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: swept ? 1 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24"
      >
        {/* Top label */}
        <MonoLabel size="xs" className="mb-8 sm:mb-10 md:mb-14 block">
          ENGINEERING SYSTEM PORTFOLIO 01
        </MonoLabel>

        {/* Main responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-6 lg:gap-10 items-start">

          {/* Left column — name, role, monolith */}
          <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4 md:gap-4">
            <DisplayHeading as="h1" size="xl">
              Rashay
              <br />
              Daya
            </DisplayHeading>

            <MonoLabel size="sm" className="block tracking-[0.12em]">
              DEVOPS ENGINEER &amp; FULL STACK BUILDER
            </MonoLabel>

            {/* Monolith — desktop WebGL, mobile typographic */}
            {isDesktop === null ? (
              <div
                style={{ marginTop: '-5rem', width: '360px', height: '400px' }}
                aria-hidden="true"
              />
            ) : isDesktop ? (
              <div
                className="relative"
                style={
                  isXLScreen
                    ? { marginTop: '-4rem', width: '440px', height: '480px' }
                    : isLargeScreen
                    ? { marginTop: '-5rem', width: '360px', height: '400px' }
                    : { marginTop: '-4rem', width: 'clamp(220px, 40%, 320px)', height: 'clamp(220px, 32vh, 340px)' }
                }
                aria-hidden="true"
              >
                <MonolithScene />
              </div>
            ) : (
              <div
                className="border border-avocatus/25 bg-avocatus/5 p-5 sm:p-6 rounded-sm mt-2 relative overflow-hidden"
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
                  RASHAY DAYA / PORTFOLIO v1.0
                  <br />
                  <span className="text-ash/60">LOCATION — JOHANNESBURG, ZA</span>
                  <br />
                  <span className="text-ash/60">COORD — 26.2041° S / 28.0473° E</span>
                  <br />
                  <span className="text-live">STATUS — LIVE</span>
                </div>
              </div>
            )}
          </div>

          {/* Right column — manifesto, CTAs, metrics, geo */}
          <div className="md:col-span-5 flex flex-col gap-8 sm:gap-10 md:gap-12 md:pt-2">
            <p className="text-ash text-[15px] sm:text-base leading-[1.6] tracking-[-0.01em] max-w-[340px]">
              I build and operate production systems.
              Infrastructure, APIs, and full-stack applications designed to scale.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3">
              <FilamentButton href="#forge">
                VIEW PROJECTS →
              </FilamentButton>
              <FilamentButton as="button" onClick={openContact}>
                GET IN TOUCH →
              </FilamentButton>
            </div>

            <dl
              className="pt-6 sm:pt-8 border-t border-ash/10"
              aria-label="Live system stats"
            >
              {systemStats.map((stat) => (
                <div
                  key={stat.key}
                  className="flex items-baseline justify-between py-2.5 border-b border-ash/[0.08] last:border-b-0"
                >
                  <dt className="font-mono text-[10px] text-ash/80 uppercase tracking-[0.08em]">
                    {stat.key}
                  </dt>
                  <dd className="font-mono text-[13px] text-satin tracking-[-0.01em]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="hidden md:block">
              <p className="font-mono text-[10px] text-ash/70 leading-[1.8] uppercase tracking-[0.08em]">
                LOCATION — JOHANNESBURG, ZA
                <br />
                COORD — 26.2041° S / 28.0473° E
                <br />
                SYSTEM — RASHAY DAYA PORTFOLIO v1.0
                <br />
                <span className="text-live/70">STATUS — LIVE</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  )
}
