'use client'

import { motion } from 'framer-motion'
import type { TerminalLine as TerminalLineData } from '@/lib/data/projects'
import { MonoLabel } from './MonoLabel'

type TerminalPanelProps = {
  label: string
  status: string
  lines: TerminalLineData[]
  stats: { label: string; value: string }[]
  compact?: boolean
  /** Change this value to replay the line-by-line open animation. */
  animationKey?: number
}

const STATUS_COLORS: Record<TerminalLineData['status'], string> = {
  ok: 'text-ash',
  run: 'text-ash',
  info: 'text-ash/60',
  pass: 'text-live',
}

const STATUS_PREFIXES: Record<TerminalLineData['status'], string> = {
  ok: '✓ ',
  run: '→ ',
  info: '  ',
  pass: '✓ ',
}

function TerminalLine({ line }: { line: TerminalLineData }) {
  return (
    <div className={`font-mono ${STATUS_COLORS[line.status]}`}>
      <span className={line.status === 'pass' ? 'text-live' : ''}>
        {STATUS_PREFIXES[line.status]}
      </span>
      <span>{line.text}</span>
    </div>
  )
}

export function TerminalPanel({
  label,
  status,
  lines,
  stats,
  compact = false,
  animationKey = 0,
}: TerminalPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* macOS titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1f24] border-b border-ash/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c941]" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-live animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-live">
            {status}
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 pt-3 pb-4">
        <MonoLabel size="sm" tone="bright" className="mb-3 block">{label}</MonoLabel>

      <div className={`font-mono text-[9px] sm:text-[10px] leading-[1.75] ${compact ? 'max-h-[100px] overflow-hidden' : ''}`}>
        {lines.map((line, i) => (
          <motion.div
            key={`${animationKey}-${i}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.18, ease: 'easeOut' }}
          >
            <TerminalLine line={line} />
          </motion.div>
        ))}
      </div>

      {stats.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-ash/10 pt-3 mt-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <MonoLabel size="xs" tone="muted">{stat.label}</MonoLabel>
              <p className="font-mono text-[10px] sm:text-[11px] text-satin tracking-[0.02em]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
