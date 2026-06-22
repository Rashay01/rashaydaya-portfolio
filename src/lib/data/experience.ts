export type ExperienceEntry = {
  kind: 'Current focus' | 'Client work' | 'Engineering project'
  title: string
  description: string
  technologies: string[]
  shipped: string[]
}

export const experienceEntries: ExperienceEntry[] = [
  {
    kind: 'Current focus',
    title: 'Cloud, platform, and delivery engineering',
    description:
      'Building reusable delivery, security, monitoring, and infrastructure workflows while pursuing junior DevOps, cloud, platform, and full-stack roles.',
    technologies: ['AWS', 'Terraform', 'GitHub Actions', 'Docker', 'Grafana'],
    shipped: [
      'Reusable infrastructure patterns',
      'CI/CD and security automation',
      'Monitoring dashboard foundations',
    ],
  },
  {
    kind: 'Client work',
    title: 'Production hospitality and event platforms',
    description:
      'Delivered responsive client platforms with frontend, API, storage, and deployment responsibilities.',
    technologies: [
      'React',
      'Node.js',
      'Firebase',
      'Cloudflare Pages',
      'Cloudflare R2',
      'Railway',
    ],
    shipped: [
      'The House of Chai production platform',
      'Event RSVP and media platform',
    ],
  },
  {
    kind: 'Engineering project',
    title: 'Infrastructure and release automation',
    description:
      'Designed repeatable infrastructure and delivery workflows that validate changes before deployment.',
    technologies: ['Terraform', 'AWS', 'GitHub Actions', 'Bash'],
    shipped: [
      'Infrastructure blueprint system',
      'Build, test, validation, and deployment pipeline',
    ],
  },
]
