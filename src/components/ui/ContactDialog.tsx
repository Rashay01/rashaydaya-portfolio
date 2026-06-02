'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import { useContact } from '@/context/ContactContext'
import { FilamentButton } from '@/components/ui/FilamentButton'
import { MonoLabel } from '@/components/ui/MonoLabel'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactDialog() {
  const { isOpen, closeContact } = useContact()
  const prefersReducedMotion = useReducedMotion()
  const overlayRef = useRef<HTMLDivElement>(null)

  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')

  const [touched, setTouched] = useState({ name: false, email: false, message: false })

  const errors = {
    name:    !name.trim()                              ? 'required' : null,
    email:   !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'valid email required' : null,
    message: !message.trim()                           ? 'required' : null,
  }
  const isValid = !errors.name && !errors.email && !errors.message

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus trap + Escape — re-runs when formState changes so the trap re-registers after DOM swaps (e.g. success state)
  useEffect(() => {
    if (!isOpen) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = overlay.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    // Focus first field when form is visible, otherwise first focusable element
    const firstField = overlay.querySelector<HTMLElement>('input:not([disabled])')
    ;(firstField ?? first)?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeContact(); return }
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
  }, [isOpen, formState, closeContact])

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setFormState('idle')
      setName('')
      setEmail('')
      setMessage('')
      setTouched({ name: false, email: false, message: false })
    }
  }, [isOpen])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (!isValid) return
    if (formState !== 'idle' && formState !== 'error') return
    setFormState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setFormState('success')
        toast.success('Message delivered — I\'ll be in touch.', {
          style: { borderColor: 'rgba(74,222,128,0.25)', color: 'var(--signal)' },
        })
      } else {
        setFormState('error')
        toast.error('Transmission failed — please try again.', {
          style: { borderColor: 'rgba(255,95,31,0.25)', color: 'var(--filament)' },
        })
      }
    } catch {
      setFormState('error')
      toast.error('Transmission failed — please try again.', {
        style: { borderColor: 'rgba(255,95,31,0.25)', color: 'var(--filament)' },
      })
    }
  }, [formState, name, email, message, isValid])

  const motionProps = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2, ease: 'easeOut' } }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          {...motionProps}
          className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-4 border-b border-ash/10">
            <MonoLabel size="xs">OPEN CHANNEL</MonoLabel>
            <button
              type="button"
              onClick={closeContact}
              className="w-11 h-11 flex items-center justify-center rounded-sm border border-ash/10 hover:border-ash/25 text-satin transition-colors duration-200 cursor-pointer font-mono text-sm"
              aria-label="Close contact form"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12">
            <div className="max-w-xl">
              <h2
                id="contact-dialog-title"
                className="font-calsans text-satin text-2xl sm:text-3xl tracking-[-0.02em] mb-8 sm:mb-10"
              >
                Start the conversation.
              </h2>

              {formState === 'success' ? (
                <div role="status">
                  <div className="space-y-1.5 mb-8">
                    <p className="font-mono text-[11px] text-ash">
                      &gt; STATUS<span className="text-ash/40">......</span>
                      <span className="text-live">DELIVERED</span>
                    </p>
                    <p className="font-mono text-[11px] text-ash">
                      &gt; RECIPIENT<span className="text-ash/40">..</span>rashay.jcdaya@gmail.com
                    </p>
                  </div>
                  <p className="font-mono text-[11px] text-ash/60 mb-8">
                    Message received. I&apos;ll be in touch.
                  </p>
                  <FilamentButton as="button" onClick={closeContact}>
                    [ CLOSE ]
                  </FilamentButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block"
                    >
                      NAME
                    </label>
                    <div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
                      <span className="font-mono text-xs text-filament mt-0.5" aria-hidden="true">&gt;</span>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        disabled={formState === 'submitting'}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, name: true }))}
                        placeholder="your name"
                        className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none disabled:opacity-50"
                        aria-describedby={touched.name && errors.name ? 'err-name' : undefined}
                        aria-invalid={touched.name && !!errors.name}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p id="err-name" role="alert" className="font-mono text-[9px] text-filament uppercase tracking-[0.08em] mt-1.5">
                        &gt; ERR: {errors.name}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block"
                    >
                      EMAIL
                    </label>
                    <div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
                      <span className="font-mono text-xs text-filament mt-0.5" aria-hidden="true">&gt;</span>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        disabled={formState === 'submitting'}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        placeholder="your@email.com"
                        className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none disabled:opacity-50"
                        aria-describedby={touched.email && errors.email ? 'err-email' : undefined}
                        aria-invalid={touched.email && !!errors.email}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p id="err-email" role="alert" className="font-mono text-[9px] text-filament uppercase tracking-[0.08em] mt-1.5">
                        &gt; ERR: {errors.email}
                      </p>
                    )}
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block"
                    >
                      MESSAGE
                    </label>
                    <div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
                      <span className="font-mono text-xs text-filament mt-0.5 leading-[1.4rem]" aria-hidden="true">&gt;</span>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        disabled={formState === 'submitting'}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, message: true }))}
                        placeholder="what's on your mind"
                        className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none resize-none disabled:opacity-50"
                        aria-describedby={touched.message && errors.message ? 'err-message' : undefined}
                        aria-invalid={touched.message && !!errors.message}
                      />
                    </div>
                    {touched.message && errors.message && (
                      <p id="err-message" role="alert" className="font-mono text-[9px] text-filament uppercase tracking-[0.08em] mt-1.5">
                        &gt; ERR: {errors.message}
                      </p>
                    )}
                  </div>

                  <div>
                    {formState === 'submitting' ? (
                      <div className="w-full space-y-2" aria-label="Transmitting…" aria-busy="true">
                        <div className="skeleton-shimmer rounded-full h-[44px] w-full" style={{ border: '1px solid rgba(255,95,31,0.2)' }} />
                        <div className="flex gap-2 pt-1">
                          <div className="skeleton-shimmer rounded-sm h-[7px] w-[30%]" />
                          <div className="skeleton-shimmer rounded-sm h-[7px] w-[20%]" />
                        </div>
                      </div>
                    ) : (
                      <FilamentButton
                        as="button"
                        type="submit"
                        className="w-full justify-center"
                      >
                        TRANSMIT →
                      </FilamentButton>
                    )}

                    {formState === 'error' && (
                      <p
                        role="alert"
                        className="font-mono text-[10px] text-filament uppercase tracking-[0.08em] mt-3"
                      >
                        &gt; ERR: transmission failed — please try again
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
