'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type ContactContextValue = {
  isOpen: boolean
  openContact: () => void
  closeContact: () => void
}

const ContactContext = createContext<ContactContextValue | null>(null)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  const openContact = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement
    setIsOpen(true)
  }, [])

  const closeContact = useCallback(() => {
    setIsOpen(false)
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
      triggerRef.current = null
    })
  }, [])

  return (
    <ContactContext.Provider value={{ isOpen, openContact, closeContact }}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContact(): ContactContextValue {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used inside <ContactProvider>')
  return ctx
}
