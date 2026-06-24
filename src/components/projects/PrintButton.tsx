'use client'

import { FilamentButton } from '@/components/ui/FilamentButton'

export function PrintButton() {
  return (
    <FilamentButton as="button" size="sm" className="print:hidden" onClick={() => window.print()}>
      Download as PDF
    </FilamentButton>
  )
}
