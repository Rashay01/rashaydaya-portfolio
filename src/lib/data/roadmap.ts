export type Roadmap = {
  updatedAt: string
  currentFocus: string[]
  learning: string[]
}

export const roadmap: Roadmap = {
  updatedAt: '2026-09-12',
  currentFocus: [
    'TOMOSHI, a three-chapter Phaser 3 lantern platformer started at the Cape Town Claude Build Day',
    'Reusable Terraform/AWS infrastructure patterns',
    'GitHub Actions delivery and security automation (Kaji Labs)',
    'Production monitoring with Grafana and Prometheus',
  ],
  learning: ['Kubernetes', 'Backstage and platform-engineering tooling'],
}
