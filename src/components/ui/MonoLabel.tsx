import type { ReactNode } from 'react'

type MonoLabelProps = {
  children: ReactNode
  size?: 'xs' | 'sm' | 'md'
  tone?: 'default' | 'muted' | 'bright'
  as?: 'span' | 'p' | 'div'
  className?: string
}

/**
 * JetBrains Mono uppercase tracked label — strictly for data/terminal/metadata contexts.
 * Never used for body copy or headings.
 */
export function MonoLabel({
  children,
  size = 'sm',
  tone = 'default',
  as: Tag = 'span',
  className = '',
}: MonoLabelProps) {
  const sizeMap = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
  }
  const toneMap = {
    default: 'text-ash',
    muted: 'text-ash/80',
    bright: 'text-satin',
  }
  return (
    <Tag
      className={`font-mono uppercase tracking-[0.1em] ${sizeMap[size]} ${toneMap[tone]} ${className}`}
    >
      {children}
    </Tag>
  )
}
