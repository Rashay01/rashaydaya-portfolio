import { notes } from './notes'

it('publishes all approved notes topics', () => {
  expect(notes.map((note) => note.title)).toEqual([
    'How I deploy React apps with Cloudflare Pages',
    'How I structure GitHub Actions for CI/CD',
    'How I use Terraform for reusable infrastructure',
    'How I built a production RSVP platform',
    'How I monitor websites with Grafana',
    'How this portfolio is built',
    'How I built ZenMarker, an Android assignment app',
    'How I built an insurance policy app on a Python training course',
    'How I built a student support system at university',
    'How I built SwapShop, an Android item-trading app',
    'How I built a zombie shooter with Three.js',
  ])
})

it('includes at least one note that is not a case-study sidecar', () => {
  expect(notes.some((note) => !note.relatedCaseStudy)).toBe(true)
})
