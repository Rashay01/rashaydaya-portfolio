import { notes } from './notes'

it('publishes all five approved notes topics', () => {
  expect(notes.map((note) => note.title)).toEqual([
    'How I deploy React apps with Cloudflare Pages',
    'How I structure GitHub Actions for CI/CD',
    'How I use Terraform for reusable infrastructure',
    'How I built a production RSVP platform',
    'How I monitor websites with Grafana',
  ])
})
