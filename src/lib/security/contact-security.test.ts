import { describe, expect, it } from 'vitest'
import {
  CONTACT_LIMITS,
  isAllowedContactOrigin,
  isContactBodyTooLarge,
  parseContactPayload,
} from './contact-validation'
import {
  CONTACT_RATE_LIMIT,
  checkContactRateLimit,
} from './contact-rate-limit'

const validPayload = {
  name: 'Rashay',
  email: 'rashay@example.com',
  message: 'Hello from the portfolio.',
  companyWebsite: '',
}

describe('contact payload security', () => {
  it('accepts a valid trimmed payload', () => {
    expect(
      parseContactPayload({
        ...validPayload,
        name: '  Rashay  ',
        message: '  Hello from the portfolio.  ',
      }),
    ).toEqual({
      ok: true,
      data: {
        name: 'Rashay',
        email: 'rashay@example.com',
        message: 'Hello from the portfolio.',
      },
    })
  })

  it.each([
    ['name', 'n'.repeat(CONTACT_LIMITS.name + 1)],
    ['email', 'e'.repeat(CONTACT_LIMITS.email) + '@example.com'],
    ['message', 'm'.repeat(CONTACT_LIMITS.message + 1)],
  ])('rejects an oversized %s', (field, value) => {
    const result = parseContactPayload({ ...validPayload, [field]: value })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(400)
  })

  it('rejects a populated honeypot', () => {
    expect(
      parseContactPayload({ ...validPayload, companyWebsite: 'https://spam.invalid' }),
    ).toEqual({ ok: false, status: 400, error: 'Invalid request' })
  })

  it('rejects non-record payloads', () => {
    expect(parseContactPayload(null)).toEqual({
      ok: false,
      status: 400,
      error: 'Invalid request',
    })
  })

  it('enforces same-origin requests when an origin is present', () => {
    expect(isAllowedContactOrigin(null, 'https://rashaydaya.co.za')).toBe(true)
    expect(
      isAllowedContactOrigin(
        'https://rashaydaya.co.za',
        'https://rashaydaya.co.za',
      ),
    ).toBe(true)
    expect(
      isAllowedContactOrigin('https://evil.example', 'https://rashaydaya.co.za'),
    ).toBe(false)
  })

  it('rejects declared request bodies larger than eight kilobytes', () => {
    expect(isContactBodyTooLarge('8192')).toBe(false)
    expect(isContactBodyTooLarge('8193')).toBe(true)
    expect(isContactBodyTooLarge(null)).toBe(false)
  })
})

describe('contact rate limit', () => {
  it('allows five requests and rejects the sixth inside ten minutes', () => {
    const key = 'test-' + Date.now()
    const now = 1_000_000

    for (let request = 0; request < CONTACT_RATE_LIMIT.requests; request += 1) {
      expect(checkContactRateLimit(key, now).allowed).toBe(true)
    }

    const blocked = checkContactRateLimit(key, now)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBe(600)
  })

  it('opens a new window after ten minutes', () => {
    const key = 'window-' + Date.now()
    const now = 2_000_000

    for (let request = 0; request < CONTACT_RATE_LIMIT.requests; request += 1) {
      checkContactRateLimit(key, now)
    }

    expect(
      checkContactRateLimit(key, now + CONTACT_RATE_LIMIT.windowMs).allowed,
    ).toBe(true)
  })
})
