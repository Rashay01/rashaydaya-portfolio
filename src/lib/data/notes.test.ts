import { notes, noteSlugs, getNote } from './notes'

const approvedTitles = [
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
  'What I built at the Claude Fable 5.1 Build Day in Cape Town',
]

it('publishes all approved notes topics from content/notes', () => {
  expect(notes.map((note) => note.title).sort()).toEqual([...approvedTitles].sort())
})

it('orders notes newest first so the generated data matches the listing', () => {
  const dates = notes.map((note) => note.publishedAt)
  expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)))
})

it('uses the markdown file name as the slug and keeps slugs unique', () => {
  expect(new Set(noteSlugs).size).toBe(noteSlugs.length)
  for (const slug of noteSlugs) {
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    expect(getNote(slug)?.slug).toBe(slug)
  }
})

it('includes at least one note that is not a case-study sidecar', () => {
  expect(notes.some((note) => !note.relatedCaseStudy)).toBe(true)
})
