import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { projects } from './projects'
import { skillCategories } from './skills'

describe('portfolio copy system', () => {
  it('uses the requested skill category headings', () => {
    expect(skillCategories.map((category) => category.header)).toEqual([
      'Cloud and Infrastructure',
      'CI/CD and Automation',
      'Backend Systems',
      'Frontend Delivery',
      'Product and AI',
    ])
  })

  it('uses exact project descriptions from the portfolio brief', () => {
    expect(projects.find((project) => project.id === 'wedding-platform')?.description).toBe(
      'Full-stack RSVP and media platform with guest validation, RSVP flows, and upload storage using Firebase and Cloudflare R2.',
    )
    expect(projects.find((project) => project.id === 'house-of-chai')?.description).toBe(
      'Production web platform for a hospitality brand, built with React, Cloudflare Pages, Node.js, and Railway.',
    )
    expect(projects.find((project) => project.id === 'infra-blueprints')?.description).toBe(
      'Reusable infrastructure blueprint system built with Terraform, AWS, GitHub Actions, and Bash.',
    )
    expect(projects.find((project) => project.id === 'vanguard-pipeline')?.description).toBe(
      'Automated delivery workflow using GitHub Actions for build, test, validation, and deployment.',
    )
  })

  it('does not use standalone R2 in project fields', () => {
    const serialized = JSON.stringify(projects)
    expect(serialized).not.toMatch(/(?<!Cloudflare )\bR2\b/)
  })

  it('adds project metadata for build year, status, and role', () => {
    for (const project of projects) {
      expect(project.built).toBe('2026')
      expect(project.statusLabel).toMatch(/Live|In progress|Case study available/)
      expect(project.role).toBeTruthy()
    }
  })

  it('caps the hero display heading at six rem', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/ui/DisplayHeading.tsx'), 'utf8')
    expect(source).toContain("xl: 'text-[clamp(2.5rem,9vw,6rem)]'")
    expect(source).not.toContain('8.5rem')
  })

  it('does not reference or ship the invalid Cal Sans font asset', () => {
    const fontPath = join(process.cwd(), 'public/fonts/CalSans-SemiBold.woff2')
    const styles = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')

    expect(existsSync(fontPath)).toBe(false)
    expect(styles).not.toContain('/fonts/CalSans-SemiBold.woff2')
    expect(styles).toContain('--font-calsans: var(--font-syne)')
  })
})
