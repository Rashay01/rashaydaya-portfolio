import type { ReactNode } from 'react'
import { MonoLabel } from './MonoLabel'
import { DisplayHeading } from './DisplayHeading'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  headingId?: string
  headingAs?: 'h1' | 'h2' | 'h3'
  actions?: ReactNode
}

/**
 * The eyebrow + display heading + description combination used by Archive and Forge.
 * Enforces consistent section rhythm across the page. Eyebrow is optional;
 * omit it where it would only restate the heading.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  headingId,
  headingAs = 'h2',
  actions,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl">
      {eyebrow && (
        <MonoLabel size="sm" className="mb-3 sm:mb-4 block">
          {eyebrow}
        </MonoLabel>
      )}
      <DisplayHeading as={headingAs} size="lg" id={headingId}>
        {title}
      </DisplayHeading>
      {description && (
        <p className="mt-4 sm:mt-6 max-w-lg text-ash/85 text-[15px] sm:text-base leading-relaxed tracking-[-0.01em]">
          {description}
        </p>
      )}
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  )
}
