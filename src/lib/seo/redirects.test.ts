import { describe, expect, it } from 'vitest'

import nextConfig from '../../../next.config.mjs'

type HostCondition = { type: string; value: string }
type RedirectRule = {
  source: string
  destination: string
  permanent: boolean
  has?: HostCondition[]
}

const WWW = 'www.rashaydaya.co.za'

async function loadRedirects(): Promise<RedirectRule[]> {
  if (!nextConfig.redirects) throw new Error('next.config.mjs does not define redirects()')
  return (await nextConfig.redirects()) as RedirectRule[]
}

function isWwwRule(rule: RedirectRule) {
  return rule.has?.some((h) => h.type === 'host' && h.value === WWW) ?? false
}

describe('host redirects', () => {
  it('permanently redirects the www root to the apex root', async () => {
    const root = (await loadRedirects()).find((r) => isWwwRule(r) && r.source === '/')
    expect(root?.destination).toBe('https://rashaydaya.co.za/')
    expect(root?.permanent).toBe(true)
  })

  it('permanently redirects www paths to the same path on the apex host', async () => {
    const paths = (await loadRedirects()).find((r) => isWwwRule(r) && r.source === '/:path+')
    expect(paths?.destination).toBe('https://rashaydaya.co.za/:path+')
    expect(paths?.permanent).toBe(true)
  })

  it('only ever redirects when the www host matches', async () => {
    const redirects = await loadRedirects()
    expect(redirects.length).toBeGreaterThan(0)
    expect(redirects.every(isWwwRule)).toBe(true)
  })
})
