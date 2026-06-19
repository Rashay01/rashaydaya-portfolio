'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MonolithSkeleton } from '@/components/three/MonolithSkeleton'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { FilamentButton } from '@/components/ui/FilamentButton'
import { useContact } from '@/context/ContactContext'

const MonolithScene = dynamic(() => import('@/components/three/MonolithScene'), {
  ssr: false,
  loading: () => <MonolithSkeleton />,
})

const systemStats = [
  { key: 'RELIABILITY', value: 'HIGH' },
  { key: 'UPTIME', value: '99.5%' },
  { key: 'DEPLOY TIME', value: '< 2 MIN' },
]

export function ZenithHero() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [swept, setSwept] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()

  useEffect(() => {
    const t = setTimeout(() => setSwept(true), prefersReducedMotion ? 0 : 1200)
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  // Builds stagger animation props for each secondary element
  function staggerProps(index: number) {
    if (prefersReducedMotion) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 },
      }
    }
    return {
      initial: { opacity: 0, y: 6 },
      animate: swept ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
      transition: { duration: 0.35, ease: [0, 0, 0.58, 1], delay: index * 0.12 },
    }
  }

  return (
    <section
      id="zenith"
      className="relative min-h-screen bg-obsidian overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* SR-only shadow content for WebGL blindspot + SEO */}
      <div className="sr-only">
        <p>
          Rashay Daya. DevOps Engineer and Full Stack Builder based in Cape Town.
          Building production systems from infrastructure to interface.
          System reliability high. Uptime 99.5%. Deployment time under 2 minutes.
        </p>
      </div>

      {!swept && <div className="sweep-line" aria-hidden="true" />}

      <div className="relative z-10 px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24">
        {/* Top label — visible immediately (LCP anchor) */}
        <MonoLabel size="xs" className="mb-8 sm:mb-10 md:mb-14 block">
          ENGINEERING SYSTEM PORTFOLIO 01
        </MonoLabel>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-6 lg:gap-10 items-start">

          {/* Left column */}
          <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4 md:gap-4">
            {/* h1 — visible immediately, this is the LCP element */}
            <DisplayHeading as="h1" size="xl" id="hero-heading">
              Rashay
              <br />
              Daya
            </DisplayHeading>

            {/* Role label — visible immediately */}
            <MonoLabel size="sm" className="block tracking-[0.12em]">
              DEVOPS ENGINEER &amp; FULL STACK BUILDER
            </MonoLabel>

            {/* Monolith — stagger index 2 */}
            <motion.div {...staggerProps(2)}>
              {/* Desktop Three.js scene — CSS-hidden on mobile, no JS null branch = no CLS */}
              <div
                className="hidden md:block relative"
                style={{ marginTop: '-5rem', width: 'clamp(220px, 40vw, 440px)', height: 'clamp(220px, 45vh, 480px)' }}
                aria-hidden="true"
              >
                {isDesktop && <MonolithScene />}
              </div>

              {/* Mobile fallback — CSS-hidden on desktop */}
              <div
                className="block md:hidden border border-avocatus/25 bg-avocatus/5 p-5 sm:p-6 rounded-sm mt-2 relative overflow-hidden"
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
                  <span className="text-ash/80">LOCATION: CAPE TOWN, SOUTH AFRICA</span>
                  <br />
                  <span className="text-ash/80">COORD: 33.9249° S / 18.4241° E</span>
                  <br />
                  <span className="text-live">STATUS: LIVE</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="md:col-span-5 flex flex-col gap-8 sm:gap-10 md:gap-12 md:pt-2">

            {/* Paragraph — visible immediately (mobile LCP candidate) */}
            <p className="text-satin/90 text-[15px] sm:text-base leading-[1.6] tracking-[-0.01em] max-w-[430px]">
              Designing, building, and deploying production-ready systems across cloud infrastructure, APIs, automation, and modern web interfaces.
            </p>

            {/* About — plain prose for Google entity understanding */}
            <p className="text-ash/80 text-[12px] leading-[1.75] tracking-[-0.005em] max-w-[390px]">
              Rashay Daya is a DevOps Engineer and Full Stack Developer based in
              Cape Town, Western Cape, South Africa. He designs and ships production systems
              using AWS, Terraform, Cloudflare, GitHub Actions, React, Next.js,
              Node.js, Python and Java.
            </p>

            {/* CTA buttons — stagger index 0 */}
            <motion.div {...staggerProps(0)} className="flex flex-col xs:flex-row flex-wrap gap-3">
              <FilamentButton href="#forge">
                View Projects
              </FilamentButton>
              <FilamentButton as="button" onClick={openContact}>
                Contact Me
              </FilamentButton>
            </motion.div>

            {/* Stats — stagger index 1 */}
            <motion.dl
              {...staggerProps(1)}
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
            </motion.dl>

            {/* Geo text — desktop only, plain CSS transition (avoids non-composited animation warning on mobile) */}
            <div className="hidden md:block">
              <p
                className="font-mono text-[10px] text-ash/90 leading-[1.8] uppercase tracking-[0.08em]"
                style={{
                  opacity: swept ? 1 : 0,
                  transform: swept ? 'none' : 'translateY(6px)',
                  transition: prefersReducedMotion ? 'none' : 'opacity 0.35s cubic-bezier(0,0,0.58,1) 0.24s, transform 0.35s cubic-bezier(0,0,0.58,1) 0.24s',
                }}
              >
                LOCATION: CAPE TOWN, SOUTH AFRICA
                <br />
                COORD: 33.9249° S / 18.4241° E
                <br />
                SYSTEM: RASHAY DAYA PORTFOLIO v1.0
                <br />
                <span className="text-live/90">STATUS: LIVE</span>
              </p>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
