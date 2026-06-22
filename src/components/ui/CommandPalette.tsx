'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useDialogBehavior } from '@/lib/hooks/useDialogBehavior'
import { caseStudies } from '@/lib/data/case-studies'

type Entry = { cmd: string; output: ReactNode }

const COMMANDS = ['/help', '/clear', 'cat resume.pdf', 'whoami', 'ls projects']
const WHOAMI_TEXT = 'Rashay Daya — Junior DevOps Engineer & Full Stack Developer — Cape Town, South Africa.'

function run(input: string, close: () => void): ReactNode {
  const cmd = input.trim().toLowerCase()

  if (cmd === '/help') {
    return (
      <ul>
        {COMMANDS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    )
  }
  if (cmd === 'whoami') return WHOAMI_TEXT
  if (cmd === 'cat resume.pdf') {
    const a = document.createElement('a')
    a.href = '/Rashay_Daya_CV.pdf'
    a.download = ''
    a.click()
    return 'Downloading resume.pdf...'
  }
  if (cmd === 'ls projects') {
    return (
      <ul className="space-y-1">
        {caseStudies.map((study) => (
          <li key={study.slug}>
            <Link href={`/projects/${study.slug}`} onClick={close} className="text-filament hover:text-signal">
              {study.title}
            </Link>
          </li>
        ))}
      </ul>
    )
  }
  if (cmd === '') return null
  return `command not found: ${input}`
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<Entry[]>([])
  const prefersReducedMotion = useReducedMotion()
  const logEndRef = useRef<HTMLDivElement>(null)

  const close = () => setIsOpen(false)
  const overlayRef = useDialogBehavior(isOpen, close)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setInput('')
      setHistory([])
    }
  }, [isOpen])

  useEffect(() => {
    logEndRef.current?.scrollIntoView?.({ block: 'end' })
  }, [history])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    if (input.trim().toLowerCase() === '/clear') {
      setHistory([])
      setInput('')
      return
    }
    setHistory((h) => [...h, { cmd: input, output: run(input, close) }])
    setInput('')
  }

  const motionProps = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2, ease: 'easeOut' } }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Open console (Ctrl/Cmd+K)"
          className="fixed bottom-0 left-0 z-40 flex h-12 min-h-12 w-14 items-center justify-center border-t border-r border-signal/25 bg-obsidian font-mono text-base text-signal hover:bg-card-hover hover:text-filament sm:h-9 sm:min-h-9 sm:w-11 sm:text-sm"
        >
          <span aria-hidden="true">&gt;_</span>
          <span className="sr-only">Open console</span>
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
        <motion.div
          ref={overlayRef}
          {...motionProps}
          className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 md:px-10 py-3 sm:py-4 border-b border-signal/20">
            <span className="font-mono text-xs text-signal">terminal</span>
            <button
              type="button"
              onClick={close}
              className="w-11 h-11 flex items-center justify-center rounded-sm border border-signal/20 hover:border-filament/60 text-signal hover:text-filament transition-colors duration-200 cursor-pointer font-mono text-sm"
              aria-label="Close command palette"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-8">
            <div className="max-w-xl space-y-3 font-mono text-sm">
              {history.map((entry, i) => (
                <div key={i}>
                  <p className="text-signal">
                    <span aria-hidden="true">&gt; </span>
                    {entry.cmd}
                  </p>
                  {entry.output != null && <div className="mt-1 text-xs text-filament">{entry.output}</div>}
                </div>
              ))}
              <form onSubmit={submit} className="flex items-center gap-2">
                <span className="text-signal" aria-hidden="true">&gt;</span>
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="/help"
                  aria-label="Command input"
                  className="flex-1 bg-transparent text-signal placeholder-signal/30 caret-filament focus:outline-none"
                />
              </form>
              <div ref={logEndRef} />
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
