export type TrustMarker = {
  label:
    | 'Live production site'
    | 'Private client project'
    | 'Public repo available'
    | 'Case study available'
    | 'Architecture available'
  href?: string
  verifiedAt?: string
}

export type ArchitectureNode = {
  id: string
  label: string
  detail: string
}

export type ArchitectureEdge = {
  from: string
  to: string
  label?: string
}

export type EvidenceItem = {
  kind: 'screenshot' | 'pipeline' | 'deployment' | 'monitoring' | 'private'
  title: string
  description: string
  image?: string
  href?: string
}

export type CaseStudyLink = {
  label: string
  href: string
  external?: boolean
}

export type CaseStudy = {
  slug: string
  title: string
  summary: string
  status: 'Live' | 'In progress' | 'Case study'
  overview: string
  problem: string
  role: string
  stack: string[]
  architecture: {
    title: string
    description: string
    nodes: ArchitectureNode[]
    edges: ArchitectureEdge[]
  }
  keyFeatures: string[]
  deployment: string
  security: string
  challenges: string[]
  lessons: string[]
  links: CaseStudyLink[]
  trustMarkers: TrustMarker[]
  evidence: EvidenceItem[]
  results?: string[]
}

function internalLinks(slug: string): CaseStudyLink[] {
  return [
    { label: 'Case study', href: '/projects/' + slug },
    { label: 'Architecture', href: '/projects/' + slug + '#architecture' },
  ]
}

function internalMarkers(slug: string): TrustMarker[] {
  return [
    { label: 'Case study available', href: '/projects/' + slug },
    {
      label: 'Architecture available',
      href: '/projects/' + slug + '#architecture',
    },
  ]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'house-of-chai',
    title: 'The House of Chai Platform',
    summary:
      'Production web platform for a hospitality brand with separately deployed frontend and API services.',
    status: 'Live',
    overview:
      'A customer-facing platform that gives The House of Chai a fast, maintainable production presence and a clear path for backend operations.',
    problem:
      'The brand needed a reliable web experience that could ship independently across frontend and backend services without tying releases to one hosting provider.',
    role: 'Frontend implementation, backend integration, deployment, and production verification.',
    stack: ['React', 'Node.js', 'Cloudflare Pages', 'Railway'],
    architecture: {
      title: 'Split frontend and API deployment',
      description:
        'Visitors load the React frontend from Cloudflare Pages. Browser requests cross the application boundary to the Node.js API deployed on Railway.',
      nodes: [
        { id: 'visitor', label: 'Visitor', detail: 'Browser session' },
        {
          id: 'frontend',
          label: 'React frontend',
          detail: 'Cloudflare Pages',
        },
        { id: 'api', label: 'Node.js API', detail: 'Railway service' },
      ],
      edges: [
        { from: 'visitor', to: 'frontend', label: 'HTTPS' },
        { from: 'frontend', to: 'api', label: 'API request' },
      ],
    },
    keyFeatures: [
      'Responsive hospitality brand experience',
      'Independent frontend and backend deployments',
      'Production health and release verification',
    ],
    deployment:
      'The frontend is deployed through Cloudflare Pages and the Node.js service is deployed independently on Railway.',
    security:
      'The public surface uses HTTPS and keeps backend configuration outside the client bundle. Private implementation details are not published.',
    challenges: [
      'Keeping frontend and backend release boundaries clear',
      'Maintaining a consistent experience across responsive layouts',
    ],
    lessons: [
      'Independent services need explicit deployment and health checks',
      'Operational clarity is as important as the initial frontend build',
    ],
    links: [
      {
        label: 'Live production site',
        href: 'https://www.thehouseofchai.co.za/',
        external: true,
      },
      ...internalLinks('house-of-chai'),
    ],
    trustMarkers: [
      {
        label: 'Live production site',
        href: 'https://www.thehouseofchai.co.za/',
        verifiedAt: '2026-06-24',
      },
      { label: 'Private client project' },
      ...internalMarkers('house-of-chai'),
    ],
    evidence: [
      {
        kind: 'screenshot',
        title: 'Live production surface',
        description:
          'The public production site is available through the verified live link.',
        href: 'https://www.thehouseofchai.co.za/',
      },
      {
        kind: 'private',
        title: 'Private deployment evidence',
        description: 'Additional deployment evidence is available on request.',
      },
    ],
    results: [
      'Live in production at thehouseofchai.co.za, independently verifiable via the link above',
      'Frontend and API ship and release independently, with no shared deploy step blocking either side',
    ],
  },
  {
    slug: 'event-rsvp-platform',
    title: 'Event RSVP & Media Platform',
    summary:
      'Full-stack guest validation, RSVP, and media workflow using Firebase and Cloudflare R2.',
    status: 'Live',
    overview:
      'A private event platform that manages guest validation, RSVP responses, and media uploads in one production experience.',
    problem:
      'The event required a controlled guest flow and reliable media handling without exposing administrative data or storage credentials.',
    role: 'Frontend, backend, deployment, guest workflow, and storage integration.',
    stack: ['React', 'Firebase', 'Cloudflare R2', 'Node.js'],
    architecture: {
      title: 'Validated guest and media flow',
      description:
        'The React client validates guest records through application services, records RSVP state in Firebase, and sends media through a controlled upload path to Cloudflare R2.',
      nodes: [
        { id: 'guest', label: 'Guest', detail: 'Validated browser flow' },
        { id: 'client', label: 'React client', detail: 'RSVP and media UI' },
        { id: 'service', label: 'Node.js service', detail: 'Validation boundary' },
        { id: 'firebase', label: 'Firebase', detail: 'Guest and RSVP data' },
        { id: 'storage', label: 'Cloudflare R2', detail: 'Media storage' },
      ],
      edges: [
        { from: 'guest', to: 'client' },
        { from: 'client', to: 'service', label: 'Validated request' },
        { from: 'service', to: 'firebase', label: 'RSVP state' },
        { from: 'service', to: 'storage', label: 'Media upload' },
      ],
    },
    keyFeatures: [
      'Guest-record validation',
      'RSVP response workflow',
      'Controlled media uploads to Cloudflare R2',
    ],
    deployment:
      'The client and application services are deployed as separate production concerns with storage credentials kept server-side.',
    security:
      'Guest validation gates RSVP actions, upload credentials are not exposed to the browser, and the client project remains private.',
    challenges: [
      'Coordinating guest identity with RSVP state',
      'Keeping media storage access controlled',
    ],
    lessons: [
      'Upload flows need explicit trust boundaries',
      'Private client work can still document architecture without exposing data',
    ],
    links: [
      {
        label: 'Live production site',
        href: 'https://www.marrying-maharaj.co.za/',
        external: true,
      },
      ...internalLinks('event-rsvp-platform'),
    ],
    trustMarkers: [
      {
        label: 'Live production site',
        href: 'https://www.marrying-maharaj.co.za/',
        verifiedAt: '2026-06-24',
      },
      { label: 'Private client project' },
      ...internalMarkers('event-rsvp-platform'),
    ],
    evidence: [
      {
        kind: 'screenshot',
        title: 'Live RSVP experience',
        description:
          'The public event surface is available through the verified live link.',
        href: 'https://www.marrying-maharaj.co.za/',
      },
      {
        kind: 'private',
        title: 'Private storage and deployment evidence',
        description: 'Additional implementation evidence is available on request.',
      },
    ],
    results: [
      'Ran the real event’s RSVP and media flow live at marrying-maharaj.co.za, independently verifiable via the link above',
      'Guest validation and media uploads handled with no exposed storage credentials',
    ],
  },
  {
    slug: 'infrastructure-blueprint-system',
    title: 'Infrastructure Blueprint System',
    summary:
      'Reusable Terraform modules and GitHub Actions validation for repeatable AWS infrastructure.',
    status: 'Case study',
    overview:
      'A reusable infrastructure system that separates shared Terraform modules from environment configuration and automated validation.',
    problem:
      'Infrastructure experiments become difficult to reproduce when configuration, validation, and environment differences are handled manually.',
    role: 'Infrastructure design, Terraform module structure, Bash automation, and CI validation.',
    stack: ['Terraform', 'AWS', 'GitHub Actions', 'Bash'],
    architecture: {
      title: 'Validated infrastructure blueprint',
      description:
        'Changes move from environment configuration through reusable Terraform modules and CI checks before reaching AWS.',
      nodes: [
        { id: 'config', label: 'Environment config', detail: 'Input variables' },
        { id: 'modules', label: 'Terraform modules', detail: 'Reusable resources' },
        { id: 'ci', label: 'GitHub Actions', detail: 'Format and validation' },
        { id: 'aws', label: 'AWS', detail: 'Target infrastructure' },
      ],
      edges: [
        { from: 'config', to: 'modules' },
        { from: 'modules', to: 'ci', label: 'Plan validation' },
        { from: 'ci', to: 'aws', label: 'Approved apply' },
      ],
    },
    keyFeatures: [
      'Reusable Terraform modules',
      'Environment-specific configuration',
      'Automated format and validation checks',
    ],
    deployment:
      'GitHub Actions validates infrastructure changes before an approved Terraform apply targets AWS. Cost considerations: module reuse across dev/staging/prod avoids duplicating module-maintenance cost across environments, and environment-specific sizing (smaller instance/storage tiers in dev and staging) keeps non-production environments cheap. Actual AWS billing for this client\'s account is private and not published.',
    security:
      'Credentials stay in deployment secrets, infrastructure changes are reviewed as code, and validation runs before apply.',
    challenges: [
      'Separating reusable modules from environment decisions',
      'Keeping automation understandable for future reuse',
    ],
    lessons: [
      'Small module interfaces are easier to validate and reuse',
      'Infrastructure plans are useful review artifacts',
    ],
    links: internalLinks('infrastructure-blueprint-system'),
    trustMarkers: [
      { label: 'Private client project' },
      ...internalMarkers('infrastructure-blueprint-system'),
    ],
    evidence: [
      {
        kind: 'private',
        title: 'Private infrastructure evidence',
        description: 'Module and plan evidence is available on request.',
      },
    ],
    results: [
      'Four reusable Terraform modules cover the project\'s three environments (dev/staging/prod) from one shared module set',
      'GitHub Actions runs format and validation on every change before a human-approved apply',
    ],
  },
  {
    slug: 'cicd-pipeline-system',
    title: 'CI/CD Pipeline System',
    summary:
      'Automated build, test, validation, and deployment workflow using GitHub Actions.',
    status: 'In progress',
    overview:
      'A delivery workflow that turns source changes into a sequence of repeatable quality and deployment checks.',
    problem:
      'Manual release steps create inconsistent results and make it difficult to see where a deployment failed.',
    role: 'Workflow design, validation stages, deployment automation, and failure visibility.',
    stack: ['GitHub Actions', 'AWS', 'Terraform', 'Bash'],
    architecture: {
      title: 'Source-to-deployment pipeline',
      description:
        'A repository event starts build and test jobs, continues through validation, and reaches deployment only after required checks pass.',
      nodes: [
        { id: 'source', label: 'Source change', detail: 'Pull request or push' },
        { id: 'build', label: 'Build', detail: 'Artifact creation' },
        { id: 'test', label: 'Test', detail: 'Automated checks' },
        { id: 'validate', label: 'Validate', detail: 'Release gate' },
        { id: 'deploy', label: 'Deploy', detail: 'Target environment' },
      ],
      edges: [
        { from: 'source', to: 'build' },
        { from: 'build', to: 'test' },
        { from: 'test', to: 'validate' },
        { from: 'validate', to: 'deploy' },
      ],
    },
    keyFeatures: [
      'Build and test stages',
      'Deployment validation gate',
      'Readable job-level failure reporting',
    ],
    deployment:
      'Deployments run only after required GitHub Actions jobs complete successfully.',
    security:
      'Deployment credentials stay in repository secrets and workflow permissions are kept explicit.',
    challenges: [
      'Keeping jobs reusable without hiding important behavior',
      'Making failures actionable from the workflow log',
    ],
    lessons: [
      'A pipeline should explain why a release stopped',
      'Explicit permissions reduce accidental workflow access',
    ],
    links: internalLinks('cicd-pipeline-system'),
    trustMarkers: internalMarkers('cicd-pipeline-system'),
    evidence: [
      {
        kind: 'private',
        title: 'Pipeline run evidence',
        description: 'Workflow run evidence will be published when available.',
      },
    ],
  },
  {
    slug: 'security-scan-action',
    title: 'Golden Security Scan',
    summary:
      'Reusable GitHub Action for frontend, backend, infrastructure, and container scanning.',
    status: 'In progress',
    overview:
      'A reusable security workflow that gives different repository types one consistent scanning entry point. This is Kaji Guard, the security scanner from Kaji Labs — its own repository is private, but it follows the same labeled-PR workflow pattern as Kaji Labs\' public PR Version Bot.',
    problem:
      'Security checks are often copied between repositories, drift over time, and produce inconsistent results.',
    role: 'Action interface, scan orchestration, failure policy, and developer-facing output.',
    stack: ['GitHub Actions', 'Node.js', 'Docker', 'Terraform'],
    architecture: {
      title: 'Repository-aware scan orchestration',
      description:
        'Repository inputs select relevant frontend, backend, infrastructure, and container checks before results are summarized.',
      nodes: [
        { id: 'repo', label: 'Repository', detail: 'Workflow caller' },
        { id: 'action', label: 'Golden action', detail: 'Scan orchestration' },
        { id: 'scanners', label: 'Security scanners', detail: 'Workload checks' },
        { id: 'summary', label: 'Job summary', detail: 'Actionable results' },
      ],
      edges: [
        { from: 'repo', to: 'action' },
        { from: 'action', to: 'scanners' },
        { from: 'scanners', to: 'summary' },
      ],
    },
    keyFeatures: [
      'Repository-type inputs',
      'Frontend, backend, IaC, and container scan stages',
      'Consistent GitHub Actions summary',
    ],
    deployment:
      'The action is designed to be called from repository workflows with explicit inputs and permissions.',
    security:
      'The workflow uses least-privilege permissions, pins external actions where possible, and avoids printing secrets.',
    challenges: [
      'Normalising results from different scanners',
      'Balancing useful defaults with repository-specific control',
    ],
    lessons: [
      'Security automation needs clear failure semantics',
      'Reusable actions should minimise caller permissions',
    ],
    links: [
      ...internalLinks('security-scan-action'),
      {
        label: 'Kaji Labs — PR Version Bot (public sibling repo)',
        href: 'https://github.com/kaji-labs/pr-version-bot',
        external: true,
      },
    ],
    trustMarkers: internalMarkers('security-scan-action'),
    evidence: [
      {
        kind: 'private',
        title: 'Action run evidence',
        description:
          "Kaji Guard's own repository is private. Kaji Labs' PR Version Bot is public and uses the same labeled-PR GitHub Actions pattern this action is built on.",
      },
    ],
  },
  {
    slug: 'monitoring-dashboard',
    title: 'Monitoring Dashboard',
    summary:
      'Grafana-based uptime and SLA dashboard for website monitoring.',
    status: 'In progress',
    overview:
      'A monitoring surface that turns website checks into readable uptime, latency, and service-level views.',
    problem:
      'A site can be online while degraded, and ad hoc checks do not provide enough history to reason about reliability.',
    role: 'Monitoring model, dashboard structure, signal selection, and operational documentation.',
    stack: ['Grafana', 'Prometheus', 'Docker', 'Linux'],
    architecture: {
      title: 'Website monitoring flow',
      description:
        'A probe checks target websites, Prometheus stores the resulting time series, and Grafana presents operational views.',
      nodes: [
        { id: 'targets', label: 'Websites', detail: 'Monitored endpoints' },
        { id: 'probe', label: 'Probe', detail: 'Availability checks' },
        { id: 'metrics', label: 'Prometheus', detail: 'Time-series metrics' },
        { id: 'grafana', label: 'Grafana', detail: 'Dashboards and SLA views' },
      ],
      edges: [
        { from: 'targets', to: 'probe' },
        { from: 'probe', to: 'metrics' },
        { from: 'metrics', to: 'grafana' },
      ],
    },
    keyFeatures: [
      'Website availability checks',
      'Latency and uptime trends',
      'Grafana SLA-oriented views',
    ],
    deployment:
      'The monitoring components are containerised for a repeatable Linux deployment.',
    security:
      'Dashboard administration is not exposed publicly, and monitored targets contain no private credentials.',
    challenges: [
      'Separating meaningful incidents from transient failures',
      'Presenting reliability without overstating incomplete data',
    ],
    lessons: [
      'Monitoring claims need a defined measurement window',
      'Dashboards should support action, not only visualise data',
    ],
    links: internalLinks('monitoring-dashboard'),
    trustMarkers: internalMarkers('monitoring-dashboard'),
    evidence: [
      {
        kind: 'private',
        title: 'Monitoring proof in progress',
        description: 'Dashboard screenshots will be added after real data is available.',
      },
    ],
  },
]

export const caseStudySlugs = caseStudies.map((study) => study.slug)

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}

function mermaidLabel(node: ArchitectureNode): string {
  const text = (node.label + '\n' + node.detail).replace(/"/g, "'")
  return node.id + '["' + text + '"]'
}

export function buildMermaidFlowchart(architecture: CaseStudy['architecture']): string {
  const nodes = architecture.nodes.map(mermaidLabel)
  const edges = architecture.edges.map((edge) => {
    const label = edge.label ? '|' + edge.label.replace(/"/g, "'") + '|' : ''
    return edge.from + ' -->' + label + ' ' + edge.to
  })
  return ['flowchart LR', ...nodes, ...edges].join('\n')
}

export type SystemsMapEdge = { from: string; to: string; label: string }

// Real cross-project relationships derived from each case study's own stack/
// description above — not placeholder data. Terraform/AWS reuse, the
// security action's IaC scan target, and the only two case studies with a
// live production URL (the things `monitoring-dashboard` actually monitors).
export const systemsMapEdges: SystemsMapEdge[] = [
  { from: 'infrastructure-blueprint-system', to: 'cicd-pipeline-system', label: 'Terraform modules' },
  { from: 'infrastructure-blueprint-system', to: 'security-scan-action', label: 'IaC scan target' },
  { from: 'security-scan-action', to: 'cicd-pipeline-system', label: 'Scan results' },
  { from: 'monitoring-dashboard', to: 'house-of-chai', label: 'Uptime monitoring' },
  { from: 'monitoring-dashboard', to: 'event-rsvp-platform', label: 'Uptime monitoring' },
]

function systemsMapNodeId(slug: string): string {
  return slug.replace(/-/g, '_')
}

export function buildSystemsMapFlowchart(): string {
  const slugs = [...new Set(systemsMapEdges.flatMap((edge) => [edge.from, edge.to]))]
  const nodes = slugs.map((slug) => {
    const title = (getCaseStudy(slug)?.title ?? slug).replace(/"/g, "'")
    return systemsMapNodeId(slug) + '["' + title + '"]'
  })
  const edges = systemsMapEdges.map(
    (edge) =>
      systemsMapNodeId(edge.from) + ' -->|' + edge.label.replace(/"/g, "'") + '| ' + systemsMapNodeId(edge.to),
  )
  const clicks = slugs.map((slug) => 'click ' + systemsMapNodeId(slug) + ' href "/projects/' + slug + '"')
  return ['flowchart LR', ...nodes, ...edges, ...clicks].join('\n')
}
