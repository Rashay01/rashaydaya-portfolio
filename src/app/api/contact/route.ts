export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { renderToStaticMarkup } from 'react-dom/server'
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
    const html = '<!DOCTYPE html>' + renderToStaticMarkup(
      ContactEmail({ name, email, message, timestamp: new Date().toISOString() })
    )

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
        subject:  `New message from ${name} — rashaydaya.co.za`,
        html,
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
