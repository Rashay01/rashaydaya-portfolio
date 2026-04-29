export type SkillCategory = {
  header: string
  skills: { name: string; tag: string }[]
}

export const skillCategories: SkillCategory[] = [
  {
    header: 'Infrastructure',
    skills: [
      { name: 'AWS', tag: 'Cloud' },
      { name: 'Terraform', tag: 'IaC' },
      { name: 'Cloudflare Pages / R2', tag: 'Edge' },
      { name: 'Firebase', tag: 'Realtime' },
      { name: 'Railway', tag: 'Deployment' },
      { name: 'GitHub Actions', tag: 'CI/CD' },
      { name: 'Docker', tag: 'Containers' },
      { name: 'Linux / Bash', tag: 'Systems' },
    ],
  },
  {
    header: 'Backend',
    skills: [
      { name: 'Node.js', tag: 'Runtime' },
      { name: 'Python', tag: 'Runtime' },
      { name: 'Java', tag: 'Enterprise' },
      { name: 'REST APIs', tag: 'API' },
      { name: 'PostgreSQL', tag: 'Database' },
      { name: 'MySQL', tag: 'Database' },
      { name: 'C# / .NET', tag: 'Enterprise' },
    ],
  },
  {
    header: 'Frontend',
    skills: [
      { name: 'React', tag: 'View Layer' },
      { name: 'Next.js', tag: 'Framework' },
      { name: 'TypeScript', tag: 'Typing' },
      { name: 'Tailwind CSS', tag: 'Styling' },
      { name: 'Framer Motion', tag: 'Animation' },
      { name: 'HTML / CSS', tag: 'Foundation' },
    ],
  },
  {
    header: 'Additional',
    skills: [
      { name: 'Azure Entra ID', tag: 'Identity' },
      { name: 'OpenAI API', tag: 'AI' },
      { name: 'Redux / Sagas', tag: 'State' },
      { name: 'Figma', tag: 'Design' },
    ],
  },
]
