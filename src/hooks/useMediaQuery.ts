'use client'

import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {}
      const mq = window.matchMedia(query)
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => null,
  )
}
