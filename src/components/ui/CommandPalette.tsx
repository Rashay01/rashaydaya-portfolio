'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useDialogBehavior } from '@/lib/hooks/useDialogBehavior'

type Entry = { id: number; cmd: string; output: ReactNode }

// Keyword -> real stack value from case-studies.ts. Deterministic "ask the
// portfolio" layer (TICKET-0036), reuses ProjectsView's tech filter via the
// ?tech= query param instead of a separate content index or model call.
const SHOW_MAP: Record<string, string> = {
  terraform: 'Terraform',
  aws: 'AWS',
  cloud: 'AWS',
  devops: 'GitHub Actions',
  automation: 'Bash',
  react: 'React',
  monitoring: 'Grafana',
}

const COMMANDS = [
  '/help',
  '/clear',
  '/close',
  'cat resume.pdf',
  'whoami',
  'ls projects',
  ...Object.keys(SHOW_MAP).map((k) => `show ${k}`),
]
const WHOAMI_TEXT = 'Rashay Daya, Junior DevOps Engineer & Full Stack Developer, Cape Town, South Africa.'

// Dynamically imported only when "ls projects" actually runs, case-studies.ts
// is large (architecture, evidence, lessons, etc.) and CommandPalette mounts
// in the root layout, so a static import would ship that weight to every page.
async function run(input: string, close: () => void, navigate: (path: string) => void): Promise<ReactNode> {
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
    const { caseStudies } = await import('@/lib/data/case-studies')
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
  if (cmd.startsWith('show ')) {
    const keyword = cmd.slice('show '.length).trim()
    const tech = SHOW_MAP[keyword]
    if (!tech) {
      return `show: no match for "${keyword}". Try: ${Object.keys(SHOW_MAP).join(', ')}`
    }
    navigate(`/projects?tech=${encodeURIComponent(tech)}`)
    close()
    return `Opening /projects filtered to ${tech}...`
  }
  if (cmd === '') return null
  return `command not found: ${input}`
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<Entry[]>([])
  const [commandLog, setCommandLog] = useState<string[]>([])
  const [historyCursor, setHistoryCursor] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const logEndRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const router = useRouter()

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
      setCommandLog([])
      setHistoryCursor(null)
    }
  }, [isOpen])

  useEffect(() => {
    logEndRef.current?.scrollIntoView?.({ block: 'end' })
  }, [history])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    setCommandLog((log) => [...log, cmd])
    setHistoryCursor(null)
    setInput('')

    if (cmd.toLowerCase() === '/clear') {
      setHistory([])
      return
    }
    if (cmd.toLowerCase() === '/close') {
      close()
      return
    }
    const id = nextId.current++
    setHistory((h) => [...h, { id, cmd, output: null }])
    run(cmd, close, (path) => router.push(path)).then((output) => {
      setHistory((h) => h.map((entry) => (entry.id === id ? { ...entry, output } : entry)))
    })
  }

  // Shell-style recall: Up/Down walks backward/forward through previously
  // typed commands, same as bash/zsh history.
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab') {
      const prefix = input.trim().toLowerCase()
      if (!prefix) return
      const matches = COMMANDS.filter((c) => c.startsWith(prefix))
      if (matches.length === 1) {
        e.preventDefault()
        setInput(matches[0])
      }
      return
    }
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    if (commandLog.length === 0) return
    e.preventDefault()

    if (e.key === 'ArrowUp') {
      const next = Math.max(0, (historyCursor ?? commandLog.length) - 1)
      setHistoryCursor(next)
      setInput(commandLog[next])
      return
    }

    const next = (historyCursor ?? commandLog.length) + 1
    if (next >= commandLog.length) {
      setHistoryCursor(null)
      setInput('')
      return
    }
    setHistoryCursor(next)
    setInput(commandLog[next])
  }

  const motionProps = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35, ease: 'easeOut' } }

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
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-obsidian/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div className="w-full max-w-2xl mx-4 rounded-xl border border-ash/10 overflow-hidden bg-obsidian flex flex-col max-h-[70vh]">
          {/* Titlebar */}
          <div className="relative flex items-center px-4 py-3 border-b border-signal/20 bg-card-raised">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={close}
                className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] hover:opacity-75 transition-opacity cursor-pointer"
                aria-label="Close command palette"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c941]" aria-hidden="true" />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-signal/40">terminal</span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-3 font-mono text-sm">
              {history.map((entry) => (
                <div key={entry.id}>
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
                  onChange={(e) => { setInput(e.target.value); setHistoryCursor(null) }}
                  onKeyDown={onInputKeyDown}
                  placeholder="/help"
                  aria-label="Command input"
                  className="flex-1 bg-transparent text-signal placeholder-signal/30 caret-filament focus:outline-none"
                />
              </form>
              <div ref={logEndRef} />
            </div>
          </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
