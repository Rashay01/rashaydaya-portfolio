export type Roadmap = {
  updatedAt: string
  currentFocus: string[]
  learning: string[]
}

export const roadmap: Roadmap = {
  updatedAt: '2026-06-24',
  currentFocus: [
    'Reusable Terraform/AWS infrastructure patterns',
    'GitHub Actions delivery and security automation (Kaji Labs)',
    'Production monitoring with Grafana and Prometheus',
  ],
  learning: ['Kubernetes', 'Backstage and platform-engineering tooling'],
}
