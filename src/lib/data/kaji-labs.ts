export type KajiLabsCategory =
  | 'Released tools'
  | 'Security tooling'
  | 'Experiments'
  | 'Research'
  | 'In progress'

// Taxonomy from stu/phase-4-improvement-reaudit.md. Only categories with a
// real, shipped or in-progress build below render in KajiLabs.tsx, no
// placeholder entries added to fill an empty category (no Experiments or
// Research entry exists yet, so those categories simply don't appear).
export const kajiLabsCategoryOrder: KajiLabsCategory[] = [
  'Released tools',
  'Security tooling',
  'Experiments',
  'Research',
  'In progress',
]

export type KajiLabsBuild = {
  title: string
  description: string
  status: 'Released' | 'In progress'
  category: KajiLabsCategory
  href?: string
  caseStudySlug?: string
  image?: string
}

export const kajiLabsBuilds: KajiLabsBuild[] = [
  {
    title: 'PR Version Bot',
    description:
      'GitHub Action that bumps semver, updates the changelog, tags, and publishes a release from a single label on a merged pull request.',
    status: 'Released',
    category: 'Released tools',
    href: 'https://github.com/kaji-labs/pr-version-bot',
    image: '/evidence/pr-version-bot.webp',
  },
  {
    title: 'Kaji Guard',
    description:
      'Reusable DevSecOps security gate: runs Trivy and Gitleaks on every PR across frontend, backend, containers, and infrastructure, then posts a pass/fail findings summary. Repository is private; the case study below uses the same labeled-PR pattern as PR Version Bot.',
    status: 'In progress',
    category: 'Security tooling',
    caseStudySlug: 'security-scan-action',
  },
]
