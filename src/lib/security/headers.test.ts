import { describe, expect, it } from 'vitest'

// @ts-expect-error Next config is a JavaScript module without declarations.
import {
  createSecurityHeaders,
  securityHeaders,
} from '../../../next.config.mjs'

describe('security headers', () => {
  it('defines the required browser security policy', () => {
    const headers = new Map(
      securityHeaders.map((header: { key: string; value: string }) => [
        header.key,
        header.value,
      ]),
    )

    expect(headers.get('Content-Security-Policy')).toContain("default-src 'self'")
    expect(headers.get('Content-Security-Policy')).toContain("frame-ancestors 'none'")
    expect(headers.get('Strict-Transport-Security')).toBe(
      'max-age=63072000; includeSubDomains; preload',
    )
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(headers.get('X-Frame-Options')).toBe('DENY')
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(headers.get('Permissions-Policy')).toBe(
      'camera=(), microphone=(), geolocation=()',
    )
  })

  it('allows React debugging and HMR only in development', () => {
    const development = new Map(
      createSecurityHeaders('development').map(
        (header: { key: string; value: string }) => [header.key, header.value],
      ),
    )
    const production = new Map(
      createSecurityHeaders('production').map(
        (header: { key: string; value: string }) => [header.key, header.value],
      ),
    )

    expect(development.get('Content-Security-Policy')).toContain("'unsafe-eval'")
    expect(development.get('Content-Security-Policy')).toContain('ws://localhost:*')
    expect(production.get('Content-Security-Policy')).not.toContain("'unsafe-eval'")
    expect(production.get('Content-Security-Policy')).not.toContain('localhost')
  })
})
