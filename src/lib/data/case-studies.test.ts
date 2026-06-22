import { describe, expect, it } from 'vitest'
import {
  buildMermaidFlowchart,
  caseStudies,
  caseStudySlugs,
  getCaseStudy,
} from './case-studies'
import { experienceEntries } from './experience'

const expectedSlugs = [
  'house-of-chai',
  'event-rsvp-platform',
  'infrastructure-blueprint-system',
  'cicd-pipeline-system',
  'security-scan-action',
  'monitoring-dashboard',
]

describe('case study registry', () => {
  it('publishes the six approved case-study slugs', () => {
    expect(caseStudySlugs).toEqual(expectedSlugs)
    expect(caseStudies).toHaveLength(6)
  })

  it('includes every required case-study section', () => {
    for (const study of caseStudies) {
      expect(study.overview).toBeTruthy()
      expect(study.problem).toBeTruthy()
      expect(study.role).toBeTruthy()
      expect(study.stack.length).toBeGreaterThan(0)
      expect(study.architecture.nodes.length).toBeGreaterThan(1)
      expect(study.keyFeatures.length).toBeGreaterThan(0)
      expect(study.deployment).toBeTruthy()
      expect(study.security).toBeTruthy()
      expect(study.challenges.length).toBeGreaterThan(0)
      expect(study.lessons.length).toBeGreaterThan(0)
      expect(study.links.length).toBeGreaterThan(0)
    }
  })

  it('uses valid architecture edge endpoints', () => {
    for (const study of caseStudies) {
      const nodeIds = new Set(study.architecture.nodes.map((node) => node.id))
      expect(nodeIds.size).toBe(study.architecture.nodes.length)

      for (const edge of study.architecture.edges) {
        expect(nodeIds.has(edge.from)).toBe(true)
        expect(nodeIds.has(edge.to)).toBe(true)
      }
    }
  })

  it('keeps trust markers and links truthful', () => {
    for (const study of caseStudies) {
      for (const link of study.links) {
        expect(link.href.trim()).not.toBe('')
      }
      for (const marker of study.trustMarkers) {
        if (marker.label !== 'Private client project') {
          expect(marker.href).toBeTruthy()
        }
      }
    }
  })

  it('looks up a study by slug', () => {
    expect(getCaseStudy('house-of-chai')?.title).toBe('The House of Chai Platform')
    expect(getCaseStudy('missing-project')).toBeUndefined()
  })
})

describe('mermaid architecture diagrams', () => {
  it('renders a flowchart definition from architecture nodes and edges', () => {
    const definition = buildMermaidFlowchart(caseStudies[0].architecture)
    expect(definition).toContain('flowchart LR')
    for (const node of caseStudies[0].architecture.nodes) {
      expect(definition).toContain(node.id + '[')
    }
  })
})

describe('homepage evidence registries', () => {
  it('describes current focus and shipped client work', () => {
    expect(experienceEntries.length).toBeGreaterThanOrEqual(3)
    expect(experienceEntries.some((entry) => entry.kind === 'Current focus')).toBe(
      true,
    )
    expect(experienceEntries.some((entry) => entry.kind === 'Client work')).toBe(
      true,
    )
    for (const entry of experienceEntries) {
      expect(entry.technologies.length).toBeGreaterThan(0)
      expect(entry.shipped.length).toBeGreaterThan(0)
    }
  })
})
