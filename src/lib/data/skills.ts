export type SkillCategory = {
  header: string
  skills: { name: string; tag: string }[]
  proof: { label: string; href: string }
  span: 'hero' | 'wide' | 'standard'
  stat: { value: string; label: string }
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
    span: 'hero',
    stat: { value: '7', label: 'SERVICES IN PRODUCTION' },
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
    span: 'wide',
    stat: { value: '5', label: 'PIPELINE STAGES' },
  },
  {
    header: 'Backend Systems',
    skills: [
      { name: 'Node.js', tag: 'Runtime' },
      { name: 'REST APIs', tag: 'API' },
    ],
    proof: { label: 'Event RSVP & Media Platform', href: '/projects/event-rsvp-platform' },
    span: 'standard',
    stat: { value: '2', label: 'CORE RUNTIMES' },
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
    span: 'standard',
    stat: { value: '5', label: 'STACK LAYERS' },
  },
  {
    header: 'Monitoring and Docs',
    skills: [
      { name: 'Technical documentation', tag: 'Docs' },
      { name: 'Dashboard design', tag: 'UI' },
    ],
    proof: { label: 'Monitoring Dashboard', href: '/projects/monitoring-dashboard' },
    span: 'standard',
    stat: { value: '2', label: 'MONITORED SURFACES' },
  },
]
