export type SkillCategory = {
  header: string
  skills: { name: string; tag: string }[]
  proof: { label: string; href: string }
}

/**
 * Every category links to the strongest concrete proof for that skill set,
 * a project case study or a published note. Skills with no real backing
 * project (Python, Java, PostgreSQL, MySQL, OpenAI API, Figma) are left out
 * rather than listed without evidence.
 */
export const skillCategories: SkillCategory[] = [
  {
    header: 'Cloud and Infrastructure',
    skills: [
      { name: 'AWS', tag: 'Cloud' },
      { name: 'Cloudflare', tag: 'Edge' },
      { name: 'Railway', tag: 'Deployment' },
      { name: 'Firebase', tag: 'Realtime' },
      { name: 'Terraform', tag: 'IaC' },
      { name: 'Docker', tag: 'Containers' },
      { name: 'Linux', tag: 'Systems' },
    ],
    proof: { label: 'Infrastructure Blueprint System', href: '/projects/infrastructure-blueprint-system' },
  },
  {
    header: 'CI/CD and Automation',
    skills: [
      { name: 'GitHub Actions', tag: 'CI/CD' },
      { name: 'Bash', tag: 'Shell' },
      { name: 'Deployment pipelines', tag: 'Delivery' },
      { name: 'Security scanning', tag: 'Checks' },
      { name: 'Release workflows', tag: 'Versioning' },
    ],
    proof: { label: 'CI/CD Pipeline System', href: '/projects/cicd-pipeline-system' },
  },
  {
    header: 'Backend Systems',
    skills: [
      { name: 'Node.js', tag: 'Runtime' },
      { name: 'REST APIs', tag: 'API' },
    ],
    proof: { label: 'Event RSVP & Media Platform', href: '/projects/event-rsvp-platform' },
  },
  {
    header: 'Frontend Delivery',
    skills: [
      { name: 'React', tag: 'View Layer' },
      { name: 'Next.js', tag: 'Framework' },
      { name: 'TypeScript', tag: 'Typing' },
      { name: 'Tailwind', tag: 'Styling' },
      { name: 'Framer Motion', tag: 'Animation' },
    ],
    proof: { label: 'The House of Chai Platform', href: '/projects/house-of-chai' },
  },
  {
    header: 'Monitoring and Docs',
    skills: [
      { name: 'Technical documentation', tag: 'Docs' },
      { name: 'Dashboard design', tag: 'UI' },
    ],
    proof: { label: 'Monitoring Dashboard', href: '/projects/monitoring-dashboard' },
  },
]
