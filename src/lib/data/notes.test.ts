import { notes } from './notes'

it('publishes all six approved notes topics', () => {
  expect(notes.map((note) => note.title)).toEqual([
    'How I deploy React apps with Cloudflare Pages',
    'How I structure GitHub Actions for CI/CD',
    'How I use Terraform for reusable infrastructure',
    'How I built a production RSVP platform',
    'How I monitor websites with Grafana',
    'How this portfolio is built',
  ])
})

it('includes at least one note that is not a case-study sidecar', () => {
  expect(notes.some((note) => !note.relatedCaseStudy)).toBe(true)
})
