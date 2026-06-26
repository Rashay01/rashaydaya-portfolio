import { describe, expect, it } from 'vitest'
import { kajiLabsBuilds, kajiLabsCategoryOrder } from './kaji-labs'

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

  it('only groups builds into real taxonomy categories, with no fabricated entries', () => {
    for (const build of kajiLabsBuilds) {
      expect(kajiLabsCategoryOrder).toContain(build.category)
    }
    // Experiments/Research have no real build yet, taxonomy categories exist,
    // but nothing fabricated to fill them.
    expect(kajiLabsBuilds.some((b) => b.category === 'Experiments')).toBe(false)
    expect(kajiLabsBuilds.some((b) => b.category === 'Research')).toBe(false)
  })
})
