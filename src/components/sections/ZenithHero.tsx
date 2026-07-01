'use client'

import { useEffect, useRef, useState } from 'react'
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

export function ZenithHero({ cvUpdatedLabel }: { cvUpdatedLabel: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [swept, setSwept] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { openContact } = useContact()
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setSwept(true), prefersReducedMotion ? 0 : 1200)
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  // One signature scroll moment: the monolith/visual scales and fades as the
  // hero scrolls past, pinned briefly. Skipped entirely under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion || !visualRef.current) return
    let scrollTrigger: { kill: () => void } | undefined
    let cancelled = false

    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled || !visualRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      scrollTrigger = ScrollTrigger.create({
        trigger: '#zenith',
        start: 'top top',
        end: '+=50%',
        scrub: true,
        pin: true,
        pinSpacing: true,
        animation: gsap.timeline().to(visualRef.current, { scale: 1.12, opacity: 0.85, ease: 'none' }),
      })
    })

    return () => {
      cancelled = true
      scrollTrigger?.kill()
    }
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
      className="relative min-h-[100dvh] bg-obsidian overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* SR-only shadow content for WebGL blindspot + SEO */}
      <div className="sr-only">
        <p>
          Rashay Daya. DevOps Engineer and Full Stack Builder based in Cape Town.
          Building production systems from infrastructure to interface.
          Focused on cloud, platform engineering, and full-stack delivery.
        </p>
      </div>

      {!swept && <div className="sweep-line" aria-hidden="true" />}

      <div className="relative z-10 px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-6 lg:gap-10 items-start">

          {/* Left column */}
          <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4 md:gap-4">
            {/* h1, visible immediately, this is the LCP element */}
            <DisplayHeading as="h1" size="xl" id="hero-heading">
              Rashay
              <br />
              Daya
            </DisplayHeading>

            {/* Role label, visible immediately */}
            <MonoLabel size="sm" className="block tracking-[0.12em]">
              DEVOPS ENGINEER &amp; FULL STACK BUILDER
            </MonoLabel>

            {/* Monolith, stagger index 2 */}
            <motion.div {...staggerProps(2)} ref={visualRef}>
              {/* Desktop Three.js scene, CSS-hidden on mobile, no JS null branch = no CLS */}
              <div
                className="hidden md:block relative"
                style={{ marginTop: '-5rem', width: 'clamp(220px, 40vw, 440px)', height: 'clamp(220px, 45vh, 480px)' }}
                aria-hidden="true"
              >
                {isDesktop && <MonolithScene />}
              </div>

              {/* Mobile fallback, CSS-hidden on desktop */}
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
                  <span className="text-ash/80">CAPE TOWN, SOUTH AFRICA</span>
                  <br />
                  <span className="text-live">STATUS: LIVE</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="md:col-span-5 flex flex-col gap-8 sm:gap-10 md:gap-12 md:pt-2">

            {/* Paragraph, visible immediately (mobile LCP candidate) */}
            <p className="text-satin/90 text-[15px] sm:text-base leading-[1.6] tracking-[-0.01em] max-w-[430px]">
              Designing, building, and deploying production-ready systems across cloud infrastructure, APIs, automation, and modern web interfaces.
            </p>

            {/* About, plain prose for Google entity understanding — sr-only, visible text above covers this */}
            <p className="sr-only">
              Rashay Daya is a DevOps Engineer and Full Stack Developer based in
              Cape Town, Western Cape, South Africa. He designs and ships production systems
              using AWS, Terraform, Cloudflare, GitHub Actions, React, Next.js,
              Node.js, Python and Java.
            </p>

            {/* CTA buttons, stagger index 0 */}
            <motion.div {...staggerProps(0)} className="flex flex-col xs:flex-row flex-wrap gap-3">
              <FilamentButton href="#forge">
                View Projects
              </FilamentButton>
              <FilamentButton as="button" onClick={openContact}>
                Contact Me
              </FilamentButton>
            </motion.div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em]">
              <span className="text-signal">CV updated: {cvUpdatedLabel}</span>
              <a className="inline-flex min-h-11 items-center text-ash hover:text-satin" href="https://github.com/Rashay01" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a className="inline-flex min-h-11 items-center text-ash hover:text-satin" href="https://za.linkedin.com/in/rashay-daya-795804262" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
