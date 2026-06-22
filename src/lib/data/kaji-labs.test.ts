import { describe, expect, it } from 'vitest'
import { kajiLabsBuilds } from './kaji-labs'

describe('Kaji Labs builds', () => {
  it('only links released builds, and only to the kaji-labs org', () => {
    expect(kajiLabsBuilds.length).toBeGreaterThan(0)
    for (const build of kajiLabsBuilds) {
      if (build.status === 'Released') {
        expect(build.href).toMatch(/^https:\/\/github\.com\/kaji-labs\//)
      } else {
        expect(build.href).toBeUndefined()
      }
    }
  })

  it('does not advertise Maki OS / Agent OS as a public build yet', () => {
    expect(kajiLabsBuilds.some((build) => /maki|agent os/i.test(build.title))).toBe(false)
  })
})
