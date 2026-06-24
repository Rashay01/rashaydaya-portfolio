'use client'

import Link from 'next/link'
import { useContact } from '@/context/ContactContext'
import { FilamentButton } from '@/components/ui/FilamentButton'

type Crumb = { label: string; href?: string }

/**
 * Breadcrumb + CV/contact actions for inner routes (project and note pages).
 * SatinCommandNav isn't mounted here, its scroll-spy targets homepage
 * section anchors that don't exist off the homepage.
 */
export function InnerNav({ crumbs }: { crumbs: Crumb[] }) {
  const { openContact } = useContact()

  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 py-5">
      <ol aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ash">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-satin">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-satin">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-3">
        <FilamentButton href="/Rashay_Daya_CV.pdf" download size="sm">
          CV
        </FilamentButton>
        <FilamentButton as="button" onClick={openContact} size="sm">
          Contact
        </FilamentButton>
      </div>
    </nav>
  )
}
