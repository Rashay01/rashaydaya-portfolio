export type Note = { title: string; summary: string; status: 'Planned' }
export const notes: Note[] = [
  { title: 'How I deploy React apps with Cloudflare Pages', summary: 'A practical release path from repository to a verified production deployment.', status: 'Planned' },
  { title: 'How I structure GitHub Actions for CI/CD', summary: 'Clear jobs, required checks, permissions, and readable failure states.', status: 'Planned' },
  { title: 'How I use Terraform for reusable infrastructure', summary: 'Separating module interfaces, environment inputs, validation, and apply.', status: 'Planned' },
  { title: 'How I built a production RSVP platform', summary: 'Guest validation, RSVP state, controlled media uploads, and deployment boundaries.', status: 'Planned' },
  { title: 'How I monitor websites with Grafana', summary: 'Turning probes and time-series data into useful uptime and SLA views.', status: 'Planned' },
]
