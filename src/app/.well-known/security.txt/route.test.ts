import { buildSecurityTxt } from '@/lib/security/security-txt'
import { GET } from './route'

describe('security.txt', () => {
  it('points Contact at GitHub private vulnerability reporting, not an email', () => {
    const body = buildSecurityTxt()
    expect(body).toContain('Contact: https://github.com/Rashay01/rashaydaya-portfolio/security/advisories/new')
    expect(body).not.toMatch(/mailto:/)
  })

  it('sets Expires just under a year out, as RFC 9116 requires', () => {
    const body = buildSecurityTxt(new Date('2026-09-26T12:00:00Z'))
    expect(body).toContain('Expires: 2027-09-25T12:00:00Z')
  })

  it('serves plain text', async () => {
    const res = GET()
    expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
    expect(await res.text()).toMatch(/^Contact: /)
  })
})
