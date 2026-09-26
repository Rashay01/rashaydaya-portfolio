import { buildSecurityTxt } from '@/lib/security/security-txt'

// Rendered at build time; every deploy pushes Expires a year out, which keeps
// it inside RFC 9116's "less than a year" rule without a manual reminder.
export const dynamic = 'force-static'

export function GET() {
  return new Response(buildSecurityTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
