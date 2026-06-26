import { describe, expect, it } from 'vitest'
import { getCvUpdatedLabel } from './cv-meta'

describe('getCvUpdatedLabel', () => {
  it('formats the CV file mtime as month and year only, no day', () => {
    const label = getCvUpdatedLabel()
    expect(label).toMatch(/^[A-Za-z]+ \d{4}$/)
  })
})
