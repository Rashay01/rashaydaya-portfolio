import { MonoLabel } from './MonoLabel'

type MetricProps = {
  label: string
  value: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'right'
}

/**
 * Label-over-value metric block. JetBrains Mono throughout.
 * The proof-of-number unit that appears on hero, cards, and terminal.
 */
export function Metric({ label, value, size = 'md', align = 'left' }: MetricProps) {
  const sizeMap = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl lg:text-5xl',
  }
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <MonoLabel size="xs" tone="muted">
        {label}
      </MonoLabel>
      <p
        className={`font-mono font-normal text-satin leading-none tracking-[-0.02em] mt-0.5 ${sizeMap[size]}`}
      >
        {value}
      </p>
    </div>
  )
}
