import type { TerminalLine as TerminalLineData } from '@/lib/data/projects'
import { MonoLabel } from './MonoLabel'

type TerminalPanelProps = {
  label: string
  status: string
  lines: TerminalLineData[]
  stats: { label: string; value: string }[]
  compact?: boolean
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

/** Single terminal line — prefix colored green for pass, otherwise status-matched. */
export function TerminalLine({ line }: { line: TerminalLineData }) {
  return (
    <div className={`font-mono ${STATUS_COLORS[line.status]}`}>
      <span className={line.status === 'pass' ? 'text-live' : ''}>
        {STATUS_PREFIXES[line.status]}
      </span>
      <span>{line.text}</span>
    </div>
  )
}

/**
 * Frosted-glass terminal panel shown on project-card hover and as the live pipeline readout.
 * Label, live status, log lines, stats row.
 */
export function TerminalPanel({
  label,
  status,
  lines,
  stats,
  compact = false,
}: TerminalPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <MonoLabel size="sm" tone="bright">
          {label}
        </MonoLabel>
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

      <div
        className={`font-mono text-[9px] sm:text-[10px] leading-[1.75] ${
          compact ? 'max-h-[120px] overflow-hidden' : ''
        }`}
      >
        {lines.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}
      </div>

      {stats.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-ash/10 pt-3 mt-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <MonoLabel size="xs" tone="muted">
                {stat.label}
              </MonoLabel>
              <p className="font-mono text-[10px] sm:text-[11px] text-satin tracking-[0.02em]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
