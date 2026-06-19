export type SkillCategory = {
  header: string
  skills: { name: string; tag: string }[]
}

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
  },
  {
    header: 'Backend Systems',
    skills: [
      { name: 'Node.js', tag: 'Runtime' },
      { name: 'Python', tag: 'Runtime' },
      { name: 'Java', tag: 'Enterprise' },
      { name: 'REST APIs', tag: 'API' },
      { name: 'PostgreSQL', tag: 'Database' },
      { name: 'MySQL', tag: 'Database' },
    ],
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
  },
  {
    header: 'Product and AI',
    skills: [
      { name: 'OpenAI API', tag: 'AI' },
      { name: 'Figma', tag: 'Design' },
      { name: 'Technical documentation', tag: 'Docs' },
      { name: 'Dashboard design', tag: 'UI' },
    ],
  },
]
