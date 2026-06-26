import type { ReactNode, ElementType } from 'react'

type DisplayHeadingProps = {
  children: ReactNode
  as?: ElementType
  size?: 'md' | 'lg' | 'xl'
  id?: string
  className?: string
}

/**
 * Cal Sans architectural display heading. Scales fluidly via clamp.
 * H1/H2 for hero names and section titles.
 */
export function DisplayHeading({
  children,
  as: Tag = 'h2',
  size = 'lg',
  id,
  className = '',
}: DisplayHeadingProps) {
  const sizeClasses = {
    md: 'text-[clamp(2rem,5vw,4.5rem)]',
    lg: 'text-[clamp(2.25rem,6vw,6rem)]',
    xl: 'text-[clamp(2.5rem,9vw,6rem)]',
  }[size]

  return (
    <Tag
      id={id}
      className={`font-calsans font-semibold text-satin leading-[0.95] tracking-[-0.03em] ${sizeClasses} ${className}`}
    >
      {children}
    </Tag>
  )
}
