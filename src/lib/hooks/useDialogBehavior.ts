'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll lock + focus trap + Escape-to-close for a fixed-overlay dialog.
 * `extraDep` lets a caller re-arm the trap after an in-place DOM swap
 * (e.g. a form switching to a success state) without closing the dialog.
 */
export function useDialogBehavior(isOpen: boolean, onClose: () => void, extraDep?: unknown) {
  const overlayRef = useRef<HTMLDivElement>(null)
  // Ref so the keydown handler always calls the latest onClose without
  // re-arming the focus trap on every render (avoids focus-steal on re-renders).
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

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

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const initial = overlay.querySelectorAll<HTMLElement>(focusableSelector)
    const firstField = overlay.querySelector<HTMLElement>('input:not([disabled])')
    ;(firstField ?? initial[0])?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      // Recomputed on every Tab press, not cached, so newly added content
      // (e.g. CommandPalette scrollback links) stays inside the trap.
      const focusable = overlay!.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
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
  }, [isOpen, extraDep])

  return overlayRef
}
