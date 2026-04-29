# Contact Form Popup — Design Spec

**Date:** 2026-04-29
**Status:** Approved

---

## Goal

Replace all `mailto:` contact links site-wide with a full-screen terminal-style dialog that collects name, email, and message, then sends via Resend + React Email. The form sends to `rashay.jcdaya@gmail.com`. The email service key is optional at build time — the UI still works without it; the API returns a clear error.

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `src/context/ContactContext.tsx` | React context — `openContact()`, `closeContact()`, `isOpen: boolean` |
| `src/components/ui/ContactDialog.tsx` | Full-screen overlay dialog, form, state machine, Resend fetch |
| `src/emails/ContactEmail.tsx` | React Email template for the email Rashay receives |
| `src/app/api/contact/route.ts` | `POST` handler — validates fields, calls Resend, returns JSON |
| `.env.example` | `RESEND_API_KEY=` placeholder |

### Modified files

| File | Change |
|---|---|
| `src/app/layout.tsx` | Wrap root with `<ContactProvider>`, render `<ContactDialog>` once inside it |
| `src/components/sections/ZenithHero.tsx` | Replace `href="mailto:..."` on GET IN TOUCH button with `onClick={() => openContact()}` |
| `src/components/sections/SignatureFooter.tsx` | Replace `href="mailto:..."` on START THE CONVERSATION / GET IN TOUCH with `onClick` |
| `src/components/nav/SatinCommandNav.tsx` | Replace `href="mailto:..."` in mobile nav GET IN TOUCH with `onClick` — must call `close()` (close mobile overlay) then `openContact()` so both don't render simultaneously |

### State flow

```
User clicks any "GET IN TOUCH" → useContact().openContact() → isOpen = true
→ ContactDialog renders overlay
→ User fills form → POST /api/contact
→ Success/error state shown in dialog
→ Escape or ✕ → closeContact() → isOpen = false
```

`ContactDialog` is mounted once in `layout.tsx` and lives above all page content. No prop drilling required anywhere.

---

## ContactContext

```ts
// src/context/ContactContext.tsx
type ContactContextValue = {
  isOpen: boolean
  openContact: () => void
  closeContact: () => void
}
```

Implemented with `useState`. `ContactProvider` wraps children and renders nothing extra — `ContactDialog` is rendered separately in layout.

---

## ContactDialog UI

### Overlay

- `fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-xl`
- Framer Motion: `initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}`
- `useReducedMotion()` guard: `duration: 0` when reduced motion preferred
- `AnimatePresence` wraps it in layout
- `role="dialog"` `aria-modal="true"` `aria-label="Contact form"`
- `document.body.style.overflow = 'hidden'` while open (same pattern as mobile nav)
- Escape key closes via `keydown` listener
- Focus trap: Tab/Shift+Tab cycles through focusable elements; first element focused on open; focus returns to trigger element on close

### Header

```
OPEN CHANNEL                                              [✕ button]
────────────────────────────────────────────────────────────────────
Start the conversation.
```

- Eyebrow: `MonoLabel` size `xs` — `OPEN CHANNEL`
- Close button: `w-11 h-11` (44px), `border border-ash/10 hover:border-ash/25`, `✕` in `text-satin`, `rounded-sm`
- Divider: `border-b border-ash/10`
- Title: `font-calsans text-satin` `text-2xl sm:text-3xl tracking-[-0.02em]` — "Start the conversation."

### Form fields

Three fields, consistent terminal prompt style:

```
NAME
> [input                    ]
────────────────────────────

EMAIL
> [input                    ]
────────────────────────────

MESSAGE
> [textarea                 ]
  [                         ]
  [                         ]
────────────────────────────
```

**Label:**
```tsx
<label className="font-mono text-[9px] text-ash/70 uppercase tracking-[0.1em] mb-2 block">
  NAME
</label>
```

**Input row:**
```tsx
<div className="flex items-start gap-2 pb-3 border-b border-ash/20 focus-within:border-filament transition-colors duration-200">
  <span className="font-mono text-xs text-filament mt-0.5" aria-hidden="true">&gt;</span>
  <input
    className="flex-1 bg-transparent font-mono text-sm text-satin placeholder-ash/30 focus:outline-none"
    placeholder="your name"
  />
</div>
```

- Name: `<input type="text">` — required
- Email: `<input type="email">` — required, validated client-side with browser native + server-side
- Message: `<textarea rows={4}>` — required, `resize-none`
- Focus state: the wrapping div's border shifts from `border-ash/20` to `border-filament`

### Submit button

Uses existing `FilamentButton` component, `w-full justify-center`.

### Form states

| State | Button label | UI |
|---|---|---|
| `idle` | `TRANSMIT →` | Normal form |
| `submitting` | `TRANSMITTING...` | Inputs `disabled`, button disabled, animated filament dot |
| `success` | — | Form replaced with terminal readout (see below) |
| `error` | `TRANSMIT →` | Inline error line below button |

**Success readout:**
```
> STATUS......DELIVERED
> RECIPIENT..rashay.jcdaya@gmail.com

Message received. I'll be in touch.
```
Font: `font-mono text-[11px] text-ash`. `DELIVERED` in `text-live`. Small `[ CLOSE ]` FilamentButton below.

**Error line:**
```tsx
<p className="font-mono text-[10px] text-filament uppercase tracking-[0.08em] mt-3">
  &gt; ERR: transmission failed — please try again
</p>
```

### Mobile

Same overlay, inputs stack full-width, textarea shrinks to 3 rows. Identical to desktop — no breakpoint-specific layout changes needed.

---

## API Route — `POST /api/contact`

**File:** `src/app/api/contact/route.ts`

**Request body:**
```ts
{ name: string; email: string; message: string }
```

**Validation (server-side):**
- All three fields must be non-empty strings after `.trim()`
- `email` must match a basic RFC pattern
- Returns `400` with `{ error: "..." }` on failure

**Missing API key:**
- If `process.env.RESEND_API_KEY` is falsy, return `503 { error: "Email service not configured" }`
- No crash, no uncaught exception

**Success flow:**
1. Instantiate `new Resend(process.env.RESEND_API_KEY)`
2. Call `resend.emails.send({ from, to, replyTo, subject, react: <ContactEmail /> })`
3. Return `200 { success: true }`

**Error flow:**
- Catch Resend errors, return `500 { error: "Failed to send" }`

**`from` address:** `onboarding@resend.dev` (Resend's default sandbox sender — works without a verified domain)

**`to` address:** `rashay.jcdaya@gmail.com`

**`reply-to`:** sender's email — reply in mail client goes directly to them

---

## React Email Template

**File:** `src/emails/ContactEmail.tsx`

**Subject line:** `New message from {name} — Technical Vanguard`

**Visual style:**
- Background: `#111418` (obsidian)
- Text: `#e8e6e1` (satin)
- Accent separators: `#ff5f1f` (filament orange)
- Font: system monospace stack

**Layout:**
```
──────────────────────────────────────
TECHNICAL VANGUARD — INBOUND MESSAGE
──────────────────────────────────────
FROM      rashay.jcdaya@gmail.com
SENDER    {name} <{email}>
TIMESTAMP {ISO 8601 timestamp}
──────────────────────────────────────

{message}

──────────────────────────────────────
Reply directly to {email}
```

---

## Environment

**`.env.example`:**
```
# Resend API key — https://resend.com/api-keys
# Add to .env.local to enable email sending
RESEND_API_KEY=
```

`.env.local` is gitignored. `.env.example` is committed.

---

## Dependencies to install

```bash
npm install resend @react-email/components
```

---

## Accessibility

- `role="dialog"` `aria-modal="true"` `aria-labelledby` pointing to the title
- Focus trap: identical implementation to `SatinCommandNav` mobile overlay
- Escape closes dialog, focus returns to the element that triggered open (ContactContext stores a `triggerRef` — the button that called `openContact()` passes its ref via a second argument)
- All inputs have `<label>` associations via `htmlFor`/`id`
- WCAG AA contrast maintained throughout (filament `#ff5f1f` on obsidian passes at large/bold text; ash/70 labels are decorative context, not primary content)
- `useReducedMotion()` respected for all Framer Motion transitions

---

## What is not in scope

- Rate limiting beyond Resend's own sending limits
- Spam / honeypot fields
- File attachments
- CAPTCHA
- Analytics events on form submission
