'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll lock + focus trap + Escape-to-close for a fixed-overlay dialog.
 * `extraDep` lets a caller re-arm the trap after an in-place DOM swap
 * (e.g. a form switching to a success state) without closing the dialog.
 */
export function useDialogBehavior(isOpen: boolean, onClose: () => void, extraDep?: unknown) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = overlay.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const firstField = overlay.querySelector<HTMLElement>('input:not([disabled])')
    ;(firstField ?? first)?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || focusable.length === 0) return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, extraDep])

  return overlayRef
}
