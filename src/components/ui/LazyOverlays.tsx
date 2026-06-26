'use client'

import dynamic from 'next/dynamic'

// Lazy-loaded: neither renders meaningful content until the user opens them
// (keyboard shortcut / button click), so keeping them out of the initial
// bundle reduces main-thread work blocking first paint/LCP on every route.
const ContactDialog = dynamic(() => import('@/components/ui/ContactDialog').then(m => m.ContactDialog), { ssr: false })
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette').then(m => m.CommandPalette), { ssr: false })

export function LazyOverlays() {
  return (
    <>
      <ContactDialog />
      <CommandPalette />
    </>
  )
}
