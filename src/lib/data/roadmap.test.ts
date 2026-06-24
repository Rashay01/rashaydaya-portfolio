import { roadmap } from './roadmap'

it('keeps current focus and learning non-empty and dated', () => {
  expect(roadmap.currentFocus.length).toBeGreaterThan(0)
  expect(roadmap.learning.length).toBeGreaterThan(0)
  expect(roadmap.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})
