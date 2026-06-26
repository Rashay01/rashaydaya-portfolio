export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  message: 4000,
} as const

const MAX_BODY_BYTES = 8 * 1024

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export type ContactPayloadResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; status: 400; error: string }

export function parseContactPayload(input: unknown): ContactPayloadResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return invalid('Invalid request')
  }

  const raw = input as Record<string, unknown>
  if (typeof raw.companyWebsite === 'string' && raw.companyWebsite.trim()) {
    return invalid('Invalid request')
  }

  if (
    typeof raw.name !== 'string' ||
    typeof raw.email !== 'string' ||
    typeof raw.message !== 'string'
  ) {
    return invalid('Invalid request')
  }

  const name = raw.name.trim()
  const email = raw.email.trim()
  const message = raw.message.trim()

  if (!name || name.length > CONTACT_LIMITS.name) {
    return invalid('Invalid name')
  }
  if (
    !email ||
    email.length > CONTACT_LIMITS.email ||
    !isValidEmail(email)
  ) {
    return invalid('Invalid email')
  }
  if (!message || message.length > CONTACT_LIMITS.message) {
    return invalid('Invalid message')
  }

  return { ok: true, data: { name, email, message } }
}

export function isAllowedContactOrigin(
  origin: string | null,
  siteUrl: string,
): boolean {
  if (!origin) return true

  try {
    return new URL(origin).origin === new URL(siteUrl).origin
  } catch {
    return false
  }
}

export function isContactBodyTooLarge(contentLength: string | null): boolean {
  if (!contentLength) return false
  const bytes = Number(contentLength)
  return Number.isFinite(bytes) && bytes > MAX_BODY_BYTES
}

function invalid(error: string): ContactPayloadResult {
  return { ok: false, status: 400, error }
}

function isValidEmail(email: string): boolean {
  if (Array.from(email).some((character) => character.trim() === '')) {
    return false
  }

  const parts = email.split('@')
  return (
    parts.length === 2 &&
    parts[0].length > 0 &&
    parts[1].includes('.') &&
    !parts[1].startsWith('.') &&
    !parts[1].endsWith('.')
  )
}
