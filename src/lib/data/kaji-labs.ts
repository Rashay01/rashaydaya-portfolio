export type KajiLabsBuild = {
  title: string
  description: string
  status: 'Released' | 'In progress'
  href?: string
}

export const kajiLabsBuilds: KajiLabsBuild[] = [
  {
    title: 'Kaji Guard',
    description:
      'Reusable DevSecOps security gate: runs Trivy and Gitleaks on every PR across frontend, backend, containers, and infrastructure, then posts a pass/fail findings summary.',
    status: 'In progress',
  },
  {
    title: 'PR Version Bot',
    description:
      'GitHub Action that bumps semver, updates the changelog, tags, and publishes a release from a single label on a merged pull request.',
    status: 'Released',
    href: 'https://github.com/kaji-labs/pr-version-bot',
  },
]
