import { describe, expect, it } from 'vitest'
import { EASE_OUT_EXPO } from './motion'

describe('motion constants', () => {
  it('EASE_OUT_EXPO is a 4-value cubic bezier tuple', () => {
    expect(EASE_OUT_EXPO).toHaveLength(4)
  })
})
