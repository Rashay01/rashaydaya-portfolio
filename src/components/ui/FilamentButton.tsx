import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type FilamentButtonProps = {
  children: ReactNode
  size?: 'sm' | 'md'
  as?: 'a' | 'button'
} & ComponentPropsWithoutRef<'a'> & ComponentPropsWithoutRef<'button'>

/**
 * The single filament-orange CTA. Outlined at rest, filled on hover.
 * Used for all primary actions (Download CV, View Projects, Start Conversation).
 */
export function FilamentButton({
  children,
  size = 'md',
  as = 'a',
  className = '',
  ...rest
}: FilamentButtonProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-[10px] min-h-[44px]'
      : 'px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-[12px] min-h-[44px]'

  const Tag = as
  return (
    <Tag
      {...(rest as any)}
      className={`inline-flex items-center gap-2 rounded-full border border-filament text-filament font-mono uppercase tracking-[0.08em] transition-colors duration-200 hover:bg-filament hover:text-obsidian whitespace-nowrap ${sizeClasses} ${className}`}
    >
      {children}
    </Tag>
  )
}
