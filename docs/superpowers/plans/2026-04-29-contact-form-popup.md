# Contact Form Popup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen terminal-style contact dialog (name/email/message) triggered by all "GET IN TOUCH" buttons site-wide, sending via Resend + React Email to rashay.jcdaya@gmail.com.

**Architecture:** A single `ContactContext` (open/close state) is provided at the root layout; `ContactDialog` is mounted once inside it and reads from context. All three contact touch points call `openContact()` via the hook — no prop drilling. The API route validates fields server-side, gracefully handles a missing `RESEND_API_KEY` (503), and sends via Resend.

**Tech Stack:** Next.js 14 App Router, React context, Framer Motion, Tailwind CSS, `resend`, `@react-email/components`, TypeScript.

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `src/context/ContactContext.tsx` | Create | `isOpen` state, `openContact()`, `closeContact()`, focus-return via `document.activeElement` capture |
| `src/components/ui/ContactDialog.tsx` | Create | Full-screen overlay, focus trap, Escape handler, form state machine, Resend fetch |
| `src/emails/ContactEmail.tsx` | Create | React Email template (dark terminal style) |
| `src/app/api/contact/route.ts` | Create | POST handler — validate, call Resend, return JSON |
| `.env.example` | Create | `RESEND_API_KEY=` placeholder |
| `src/app/layout.tsx` | Modify | Wrap body with `<ContactProvider>`, mount `<ContactDialog>` once |
| `src/components/sections/ZenithHero.tsx` | Modify | Replace `href="mailto:..."` with `as="button" onClick={() => openContact()}` |
| `src/components/sections/SignatureFooter.tsx` | Modify | Same |
| `src/components/nav/SatinCommandNav.tsx` | Modify | Replace `<a href="mailto:...">` with button calling `close()` then `openContact()` |

---

## Task 1: Install dependencies and create .env.example

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env.example`

- [ ] **Step 1: Install resend and react-email**

  ```bash
  npm install resend @react-email/components
  ```

  Expected: added to `node_modules`, `package.json` shows both packages under `dependencies`.

- [ ] **Step 2: Create .env.example**

  Create `.env.example` at the project root with this exact content:

  ```
  # Resend API key — https://resend.com/api-keys
  # Copy this file to .env.local and add your key to enable email sending
  RESEND_API_KEY=
  ```

- [ ] **Step 3: Verify .env.local is gitignored**

  ```bash
  grep ".env.local" .gitignore
  ```

  Expected: `.env.local` appears in `.gitignore`. If it doesn't, add it:
  ```bash
  echo ".env.local" >> .gitignore
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add package.json package-lock.json .env.example .gitignore
  git commit -m "feat(contact): install resend + react-email, add .env.example"
  ```

---

## Task 2: ContactContext

**Files:**
- Create: `src/context/ContactContext.tsx`

The context captures `document.activeElement` at call time so focus returns to the exact trigger button when the dialog closes — no ref forwarding needed on `FilamentButton`.

- [ ] **Step 1: Create `src/context/ContactContext.tsx`**

  ```tsx
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
      requestAnimationFrame(() => triggerRef.current?.focus())
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
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors referencing `ContactContext.tsx`.

- [ ] **Step 3: Commit**

  ```bash
  git add src/context/ContactContext.tsx
  git commit -m "feat(contact): add ContactContext with open/close state"
  ```

---

## Task 3: React Email template

**Files:**
- Create: `src/emails/ContactEmail.tsx`

- [ ] **Step 1: Create `src/emails/ContactEmail.tsx`**

  ```tsx
  import {
    Body,
    Container,
    Hr,
    Html,
    Text,
  } from '@react-email/components'

  type ContactEmailProps = {
    name: string
    email: string
    message: string
    timestamp: string
  }

  const mono = 'Courier New, Courier, monospace'

  const styles = {
    body: {
      backgroundColor: '#111418',
      margin: '0',
      padding: '0',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    header: {
      fontFamily: mono,
      fontSize: '10px',
      color: '#ff5f1f',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.12em',
      margin: '0 0 4px',
    },
    divider: {
      borderColor: '#ff5f1f',
      borderTopWidth: '1px',
      margin: '12px 0',
    },
    label: {
      fontFamily: mono,
      fontSize: '9px',
      color: '#94A3B8',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
      margin: '8px 0 2px',
    },
    value: {
      fontFamily: mono,
      fontSize: '12px',
      color: '#e8e6e1',
      margin: '0 0 4px',
    },
    messageBody: {
      fontFamily: mono,
      fontSize: '13px',
      color: '#e8e6e1',
      lineHeight: '1.7',
      whiteSpace: 'pre-wrap' as const,
      margin: '0',
    },
    footer: {
      fontFamily: mono,
      fontSize: '9px',
      color: '#94A3B8',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      margin: '0',
    },
  }

  export function ContactEmail({ name, email, message, timestamp }: ContactEmailProps) {
    return (
      <Html>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Text style={styles.header}>Technical Vanguard — Inbound Message</Text>
            <Hr style={styles.divider} />
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>rashay.jcdaya@gmail.com</Text>
            <Text style={styles.label}>Sender</Text>
            <Text style={styles.value}>{name} &lt;{email}&gt;</Text>
            <Text style={styles.label}>Timestamp</Text>
            <Text style={styles.value}>{timestamp}</Text>
            <Hr style={styles.divider} />
            <Text style={styles.messageBody}>{message}</Text>
            <Hr style={styles.divider} />
            <Text style={styles.footer}>Reply directly to {email}</Text>
          </Container>
        </Body>
      </Html>
    )
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/emails/ContactEmail.tsx
  git commit -m "feat(contact): add React Email template (dark terminal style)"
  ```

---

## Task 4: API route

**Files:**
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Create the directory and file**

  ```bash
  mkdir -p src/app/api/contact
  ```

  Then create `src/app/api/contact/route.ts`:

  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { Resend } from 'resend'
  import { ContactEmail } from '@/emails/ContactEmail'

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  export async function POST(req: NextRequest) {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const raw = body as Record<string, unknown>
    const name    = String(raw.name    ?? '').trim()
    const email   = String(raw.email   ?? '').trim()
    const message = String(raw.message ?? '').trim()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 },
      )
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from:    'Technical Vanguard <onboarding@resend.dev>',
        to:      'rashay.jcdaya@gmail.com',
        replyTo: email,
        subject: `New message from ${name} — Technical Vanguard`,
        react:   ContactEmail({
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
        }),
      })
      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/api/contact/route.ts
  git commit -m "feat(contact): add POST /api/contact route with Resend"
  ```

---

## Task 5: ContactDialog component

**Files:**
- Create: `src/components/ui/ContactDialog.tsx`

This is the largest task. The component uses the same focus trap and scroll-lock pattern as `SatinCommandNav`.

- [ ] **Step 1: Create `src/components/ui/ContactDialog.tsx`**

  ```tsx
  'use client'

  import { useCallback, useEffect, useRef, useState } from 'react'
  import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
  import { useContact } from '@/context/ContactContext'
  import { FilamentButton } from '@/components/ui/FilamentButton'
  import { MonoLabel } from '@/components/ui/MonoLabel'

  type FormState = 'idle' | 'submitting' | 'success' | 'error'

  export function ContactDialog() {
    const { isOpen, closeContact } = useContact()
    const prefersReducedMotion = useReducedMotion()
    const overlayRef = useRef<HTMLDivElement>(null)

    const [formState, setFormState] = useState<FormState>('idle')
    const [name, setName]       = useState('')
    const [email, setEmail]     = useState('')
    const [message, setMessage] = useState('')

    // Scroll lock
    useEffect(() => {
      document.body.style.overflow = isOpen ? 'hidden' : ''
      return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Focus trap + Escape
    useEffect(() => {
      if (!isOpen) return
      const overlay = overlayRef.current
      if (!overlay) return

      const focusable = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      first?.focus()

      function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') { closeContact(); return }
        if (e.key !== 'Tab') return
        if (focusable.length === 0) { e.preventDefault(); return }
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus() }
        }
      }

      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, closeContact])

    // Reset form on close
    useEffect(() => {
      if (!isOpen) {
        setFormState('idle')
        setName('')
        setEmail('')
        setMessage('')
      }
    }, [isOpen])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
      e.preventDefault()
      setFormState('submitting')
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        })
        setFormState(res.ok ? 'success' : 'error')
      } catch {
        setFormState('error')
      }
    }, [name, email, message])

    const motionProps = prefersReducedMotion
      ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2, ease: 'easeOut' } }

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={overlayRef}
            {...motionProps}
            className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-4 border-b border-ash/10">
              <MonoLabel size="xs">OPEN CHANNEL</MonoLabel>
              <button
                onClick={closeContact}
                className="w-11 h-11 flex items-center justify-center rounded-sm border border-ash/10 hover:border-ash/25 text-satin transition-colors duration-200 cursor-pointer font-mono text-sm"
                aria-label="Close contact form"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12">
              <div className="max-w-xl">
                <h2
                  id="contact-dialog-title"
                  className="font-calsans text-satin text-2xl sm:text-3xl tracking-[-0.02em] mb-8 sm:mb-10"
                >
                  Start the conversation.
                </h2>

                {formState === 'success' ? (
                  <div>
                    <div className="space-y-1.5 mb-8">
                      <p className="font-mono text-[11px] text-ash">
                        &gt; STATUS<span className="text-ash/40">......</span>
                        <span className="text-live">DELIVERED</span>
                      </p>
                      <p className="font-mono text-[11px] text-ash">
                        &gt; RECIPIENT<span className="text-ash/40">..</span>rashay.jcdaya@gmail.com
                      </p>
                    </div>
                    <p className="font-mono text-[11px] text-ash/60 mb-8">
                      Message received. I&apos;ll be in touch.
                    </p>
                    <FilamentButton as="button" onClick={closeContact}>
                      [ CLOSE ]
                    </FilamentButton>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block"
                      >
                        NAME
                      </label>
                      <div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
                        <span className="font-mono text-xs text-filament mt-0.5" aria-hidden="true">&gt;</span>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          disabled={formState === 'submitting'}
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="your name"
                          className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block"
                      >
                        EMAIL
                      </label>
                      <div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
                        <span className="font-mono text-xs text-filament mt-0.5" aria-hidden="true">&gt;</span>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          disabled={formState === 'submitting'}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block"
                      >
                        MESSAGE
                      </label>
                      <div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
                        <span className="font-mono text-xs text-filament mt-0.5 leading-[1.4rem]" aria-hidden="true">&gt;</span>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          disabled={formState === 'submitting'}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          placeholder="what's on your mind"
                          className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none resize-none disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <FilamentButton
                        as="button"
                        type="submit"
                        disabled={formState === 'submitting'}
                        className="w-full justify-center"
                      >
                        {formState === 'submitting' ? 'TRANSMITTING...' : 'TRANSMIT →'}
                      </FilamentButton>

                      {formState === 'error' && (
                        <p className="font-mono text-[10px] text-filament uppercase tracking-[0.08em] mt-3">
                          &gt; ERR: transmission failed — please try again
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/ui/ContactDialog.tsx
  git commit -m "feat(contact): add ContactDialog — full-screen terminal overlay"
  ```

---

## Task 6: Wire ContactProvider and ContactDialog into layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

The current `layout.tsx` body is:
```tsx
<body className="bg-obsidian text-satin antialiased">
  <a href="#main" className="...">Skip to main content</a>
  {children}
</body>
```

- [ ] **Step 1: Add imports**

  At the top of `src/app/layout.tsx`, after the existing imports, add:

  ```tsx
  import { ContactProvider } from '@/context/ContactContext'
  import { ContactDialog } from '@/components/ui/ContactDialog'
  ```

- [ ] **Step 2: Wrap body contents**

  Replace the `<body>` block so it reads:

  ```tsx
  <body className="bg-obsidian text-satin antialiased">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-filament focus:text-obsidian focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:rounded-sm"
    >
      Skip to main content
    </a>
    <ContactProvider>
      {children}
      <ContactDialog />
    </ContactProvider>
  </body>
  ```

  Note: `ContactDialog` must be inside `ContactProvider` (it uses the context), but after `{children}` so it renders above page content via `z-50`.

- [ ] **Step 3: Verify build compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/layout.tsx
  git commit -m "feat(contact): mount ContactProvider and ContactDialog in root layout"
  ```

---

## Task 7: Wire contact buttons site-wide

**Files:**
- Modify: `src/components/sections/ZenithHero.tsx`
- Modify: `src/components/sections/SignatureFooter.tsx`
- Modify: `src/components/nav/SatinCommandNav.tsx`

### 7a — ZenithHero.tsx

- [ ] **Step 1: Add import for useContact**

  In `src/components/sections/ZenithHero.tsx`, add to the existing imports:

  ```tsx
  import { useContact } from '@/context/ContactContext'
  ```

- [ ] **Step 2: Call hook inside the component**

  Inside `export function ZenithHero()`, after the existing hooks, add:

  ```tsx
  const { openContact } = useContact()
  ```

- [ ] **Step 3: Replace the GET IN TOUCH FilamentButton**

  Find:
  ```tsx
  <FilamentButton href="mailto:rashay.jcdaya@gmail.com">
    GET IN TOUCH →
  </FilamentButton>
  ```

  Replace with:
  ```tsx
  <FilamentButton as="button" onClick={openContact}>
    GET IN TOUCH →
  </FilamentButton>
  ```

### 7b — SignatureFooter.tsx

- [ ] **Step 4: Add import for useContact**

  In `src/components/sections/SignatureFooter.tsx`, add to the existing imports:

  ```tsx
  import { useContact } from '@/context/ContactContext'
  ```

- [ ] **Step 5: Call hook inside the component**

  Inside `export function SignatureFooter()`, after the existing hooks, add:

  ```tsx
  const { openContact } = useContact()
  ```

- [ ] **Step 6: Replace the START THE CONVERSATION FilamentButton**

  Find:
  ```tsx
  <FilamentButton href="mailto:rashay.jcdaya@gmail.com" aria-label="Send Rashay an email">
    <span className="hidden sm:inline">START THE CONVERSATION →</span>
    <span className="sm:hidden">GET IN TOUCH →</span>
  </FilamentButton>
  ```

  Replace with:
  ```tsx
  <FilamentButton as="button" onClick={openContact} aria-label="Open contact form">
    <span className="hidden sm:inline">START THE CONVERSATION →</span>
    <span className="sm:hidden">GET IN TOUCH →</span>
  </FilamentButton>
  ```

### 7c — SatinCommandNav.tsx

The mobile nav has its own `close()` function to dismiss the overlay. We must call it before `openContact()` so both overlays don't render simultaneously.

- [ ] **Step 7: Add import for useContact**

  In `src/components/nav/SatinCommandNav.tsx`, add to the existing imports:

  ```tsx
  import { useContact } from '@/context/ContactContext'
  ```

- [ ] **Step 8: Call hook inside the component**

  Inside `export function SatinCommandNav()`, after the existing hooks, add:

  ```tsx
  const { openContact } = useContact()
  ```

- [ ] **Step 9: Replace the mobile GET IN TOUCH anchor**

  Find:
  ```tsx
  <a
    href="mailto:rashay.jcdaya@gmail.com"
    className="btn-filament w-full justify-center"
    onClick={close}
  >
    GET IN TOUCH →
  </a>
  ```

  Replace with:
  ```tsx
  <button
    className="btn-filament w-full justify-center cursor-pointer"
    onClick={() => { close(); openContact() }}
  >
    GET IN TOUCH →
  </button>
  ```

- [ ] **Step 10: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors across all three modified files.

- [ ] **Step 11: Commit**

  ```bash
  git add src/components/sections/ZenithHero.tsx \
          src/components/sections/SignatureFooter.tsx \
          src/components/nav/SatinCommandNav.tsx
  git commit -m "feat(contact): wire GET IN TOUCH buttons to ContactDialog site-wide"
  ```

---

## Task 8: Build verification

**Files:** Read-only — verifying everything above.

- [ ] **Step 1: Run production build**

  ```bash
  npm run build
  ```

  Expected:
  ```
  ✓ Compiled successfully
  ✓ Generating static pages (3/3)
  ```

  Any TypeScript or import error here is a bug introduced above. Fix before proceeding.

- [ ] **Step 2: Smoke-test the API route response when key is missing**

  Start dev server in another terminal:
  ```bash
  npm run dev
  ```

  In a new terminal (without `RESEND_API_KEY` in `.env.local`):
  ```bash
  curl -s -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Hello"}' | cat
  ```

  Expected response: `{"error":"Email service not configured"}` with HTTP 503.

- [ ] **Step 3: Smoke-test validation**

  ```bash
  curl -s -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"","email":"not-an-email","message":""}' | cat
  ```

  Expected: `{"error":"Name is required"}` with HTTP 400.

- [ ] **Step 4: Final commit**

  ```bash
  git add .
  git commit -m "feat(contact): contact form popup complete — Resend + React Email + terminal dialog"
  ```

---

## Iteration Guide

| Symptom | Cause | Fix |
|---|---|---|
| Dialog doesn't open | `ContactProvider` not wrapping the trigger component | Confirm `layout.tsx` wraps children with `<ContactProvider>` |
| Focus doesn't return after close | `document.activeElement` was `<body>` at open time | Ensure the trigger button is actually focused (keyboard) or clicked before `openContact()` runs |
| Background bleeds through on iOS | `backdrop-blur-xl` on `bg-obsidian/95` | Add `bg-obsidian` as fallback in className |
| TypeScript error on `as="button"` | `FilamentButton` prop types conflict | The existing `{...rest as any}` cast handles it — ensure you're not passing `href` alongside `as="button"` |
| Email sends but arrives blank | React Email SSR issue | Ensure `ContactEmail` is called as a function `ContactEmail({...})` not `<ContactEmail {...} />` in the route |
| 503 when key is set | Env var not loaded | Confirm key is in `.env.local` (not `.env`), restart dev server after adding |
