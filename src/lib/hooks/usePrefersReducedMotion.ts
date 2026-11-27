'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getSnapshot() {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches
}

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion.
 *
 * The server can't know the visitor's motion preference, so it always renders
 * the full-motion markup. framer-motion's hook returns the real preference on
 * the very first client render, which made reduced-motion visitors fail
 * hydration (React #418) wherever a component rendered different elements.
 * useSyncExternalStore renders the server value (false) during hydration and
 * switches to the real preference straight after, so markup always matches.
 *
 * Components must therefore treat "reduced" as something that can arrive
 * after mount: animate to the visible end state with duration 0 rather than
 * passing an empty animate target.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
