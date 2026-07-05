import { describe, expect, it } from 'vitest'
import { createCloudTexture, makeNoiseTexture } from './monolith-textures'

describe('monolith textures', () => {
  it('cloud texture is size*size RGBA and deterministic', () => {
    const a = createCloudTexture(32)
    const b = createCloudTexture(32)
    expect(a.image.data.length).toBe(32 * 32 * 4)
    expect(Array.from(a.image.data.slice(0, 64))).toEqual(Array.from(b.image.data.slice(0, 64)))
  })
  it('noise texture repeats and is 256x256 RGBA', () => {
    const t = makeNoiseTexture()
    expect(t.image.data.length).toBe(256 * 256 * 4)
    expect(t.repeat.x).toBe(3)
  })
})
