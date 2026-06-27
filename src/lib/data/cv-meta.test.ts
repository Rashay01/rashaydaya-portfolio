import { describe, expect, it } from 'vitest'
import { getCvUpdatedLabel } from './cv-meta'

describe('getCvUpdatedLabel', () => {
  it('returns month and year format', () => {
    const label = getCvUpdatedLabel()
    expect(label).toMatch(/^[A-Za-z]+ \d{4}$/)
  })
})
