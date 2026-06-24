export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { contactEmailHtml } from '@/emails/contactEmailHtml'
import {
  isAllowedContactOrigin,
  isContactBodyTooLarge,
  parseContactPayload,
} from '@/lib/security/contact-validation'
import { checkContactRateLimit } from '@/lib/security/contact-rate-limit'

export async function POST(req: NextRequest) {
  const requestOrigin = req.headers.get('origin')
  const siteOrigin = new URL(req.url).origin

  if (!isAllowedContactOrigin(requestOrigin, siteOrigin)) {
    return NextResponse.json({ error: 'Request not allowed' }, { status: 403 })
  }

  if (isContactBodyTooLarge(req.headers.get('content-length'))) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 415 })
  }

  const clientKey =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  const rateLimit = checkContactRateLimit(clientKey)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = parseContactPayload(body)
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.error },
      { status: parsed.status },
    )
  }
  const { name, email, message } = parsed.data

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 503 },
    )
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:     'Rashay Daya <no-reply@rashaydaya.co.za>',
        to:       ['rashay.jcdaya@gmail.com'],
        reply_to: email,
        subject:  `New message from ${name} via rashaydaya.co.za`,
        html:     contactEmailHtml({ name, email, message, timestamp: new Date().toISOString() }),
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
