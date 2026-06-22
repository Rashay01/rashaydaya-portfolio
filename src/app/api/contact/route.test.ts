import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const payload = {
  name: 'Rashay',
  email: 'rashay@example.com',
  message: 'A valid portfolio enquiry.',
  companyWebsite: '',
}

function contactRequest(
  body: unknown,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest('https://rashaydaya.co.za/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://rashaydaya.co.za',
      'cf-connecting-ip': '192.0.2.' + Math.floor(Math.random() * 200),
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    )
  })

  it('rejects a cross-origin request before sending email', async () => {
    const response = await POST(
      contactRequest(payload, { origin: 'https://evil.example' }),
    )

    expect(response.status).toBe(403)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a declared body larger than eight kilobytes', async () => {
    const response = await POST(
      contactRequest(payload, { 'content-length': '8193' }),
    )

    expect(response.status).toBe(413)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a populated honeypot', async () => {
    const response = await POST(
      contactRequest({ ...payload, companyWebsite: 'https://spam.invalid' }),
    )

    expect(response.status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends a validated same-origin request', async () => {
    const response = await POST(contactRequest(payload))

    expect(response.status).toBe(200)
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('returns 429 on the sixth request from one address', async () => {
    const ip = '198.51.100.42'
    let response = new Response()

    for (let request = 0; request < 6; request += 1) {
      response = await POST(contactRequest(payload, { 'cf-connecting-ip': ip }))
    }

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBeTruthy()
  })
})
