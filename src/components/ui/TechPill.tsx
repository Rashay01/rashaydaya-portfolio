type TechPillProps = {
  label: string
}

/**
 * Inline tech stack identifier. JetBrains Mono, uppercase, bordered.
 * Used on project cards to surface the stack before hover reveals the terminal.
 */
export function TechPill({ label }: TechPillProps) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm border border-ash/20 bg-ash/5 text-ash font-mono text-xs uppercase tracking-wide">
      {label}
    </span>
  )
}
