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

// Categorizes each node so the diagram can color actors, apps, services,
// data stores, infra targets, and pipeline steps distinctly instead of one
// uniform box color.
export type ArchitectureNodeKind = 'actor' | 'app' | 'service' | 'data' | 'infra' | 'step'

export type ArchitectureNode = {
  id: string
  label: string
  detail: string
  kind: ArchitectureNodeKind
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
      'Production web platform for a hospitality brand: a Vite/React frontend, a domain-driven backend-for-frontend, and Terraform-managed asset infrastructure, each deployed and released independently.',
    status: 'Live',
    overview:
      'The House of Chai needed a production site that could take contact and booking requests without a database, a generic contact form, or a single point of failure between marketing content and request handling. The frontend (React, Vite, Tailwind) ships to Cloudflare Pages. A separate backend-for-frontend handles every contact and booking submission, built as small, ordered layers: domain entities and value objects with no framework dependencies, a thin application layer for orchestration, and an infrastructure layer that adapts to Resend for email. Brand assets are served from a Cloudflare R2 bucket behind a custom CDN domain, provisioned through Terraform rather than configured by hand in a dashboard.',
    problem:
      'The brand needed a reliable web experience that could ship independently across frontend and backend services without tying releases to one hosting provider, and every request handler had to resist the obvious abuse vectors: spoofed form submissions, scraped HMAC keys, and unbounded request volume.',
    role: 'Frontend implementation, backend-for-frontend design, asset infrastructure (Terraform), deployment, and production verification.',
    stack: ['React', 'Vite', 'Fastify', 'Cloudflare Pages', 'Cloudflare R2', 'Railway', 'Terraform'],
    architecture: {
      title: 'Domain-driven BFF with Terraform-managed asset CDN',
      description:
        'The React frontend on Cloudflare Pages talks to a Fastify backend-for-frontend on Railway over HMAC-SHA256-signed requests. The BFF\'s domain layer never imports from infrastructure: a contact or booking submission moves through validation, an application use case, and only then an adapter that calls the Resend API. Brand assets bypass the BFF entirely, served straight from a Terraform-provisioned R2 bucket behind its own CDN domain.',
      nodes: [
        { id: 'visitor', label: 'Visitor', detail: 'Browser session', kind: 'actor' },
        {
          id: 'frontend',
          label: 'React frontend',
          detail: 'Vite, Cloudflare Pages',
          kind: 'app',
        },
        { id: 'bff', label: 'Fastify BFF', detail: 'Domain-driven, Railway', kind: 'service' },
        { id: 'email', label: 'Resend', detail: 'Branded transactional email', kind: 'infra' },
        { id: 'assets', label: 'R2 asset CDN', detail: 'Terraform-managed', kind: 'data' },
      ],
      edges: [
        { from: 'visitor', to: 'frontend', label: 'HTTPS' },
        { from: 'frontend', to: 'bff', label: 'HMAC-signed request' },
        { from: 'bff', to: 'email', label: 'Contact / booking email' },
        { from: 'frontend', to: 'assets', label: 'Brand assets' },
      ],
    },
    keyFeatures: [
      'Domain-driven BFF: entities and value objects with zero framework dependencies, dependencies only flow inward',
      'HMAC-SHA256 request signing, rate limiting, and CSRF protection on every contact/booking submission',
      'Branded HTML email templates rendered server-side and sent via Resend, no client-exposed API keys',
      'Terraform-managed R2 bucket with a custom CDN domain for brand assets, version-controlled rather than dashboard-configured',
    ],
    deployment:
      'The frontend deploys through Cloudflare Pages and the Fastify BFF deploys independently on Railway. Asset infrastructure is provisioned through Terraform against a Cloudflare R2 backend, so the CDN domain and CORS rules live in version control instead of a dashboard someone has to remember to update.',
    security:
      'Every contact and booking request is authenticated with an HMAC-SHA256 signature shared between frontend and BFF, then passed through rate limiting and CSRF checks before it reaches a handler. Input is validated against Zod schemas shared between layers, so a malformed or malicious payload never reaches the domain layer. Backend configuration and the Resend API key stay server-side; nothing related to email delivery ships in the client bundle.',
    challenges: [
      'Keeping the domain layer pure, no Fastify types or Resend SDK calls leaking into entities or value objects',
      'Signing every request without adding latency a visitor would notice on a contact form',
      'Moving asset hosting from manual dashboard configuration to Terraform without downtime on the live CDN domain',
    ],
    lessons: [
      'A backend-for-frontend earns its layering even at small scale: the email-template change that would have touched a route handler instead touched one adapter',
      'Independent services need explicit deployment and health checks, not just independent repos',
      'Infrastructure that started as a dashboard click is worth migrating to Terraform before it grows a second environment',
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
      'Frontend and BFF ship and release independently, with no shared deploy step blocking either side',
      'BFF test coverage at 86.6%, frontend at 94.1%, both enforced in CI rather than measured occasionally',
    ],
  },
  {
    slug: 'event-rsvp-platform',
    title: 'Event RSVP & Media Platform',
    summary:
      'Multi-event guest RSVP and photo-gallery platform: Express on Firestore, Terraform-provisioned R2 storage, and a three-version image pipeline that keeps storage cost close to nothing.',
    status: 'Live',
    overview:
      'Guests needed to RSVP across several ceremonies on one form, see who else in their family group was attending, and upload event photos without creating an account. The backend is Express on Firestore, with a deliberate split: the Firestore Client SDK handles family and guest records, the Admin SDK handles photo metadata and moderation, so the two concerns never share a trust boundary by accident. Every photo upload gets processed into three versions (original, a 1200px compressed copy, and a 300x300 thumbnail) before it reaches Cloudflare R2, so the gallery never serves a multi-megabyte original to a guest scrolling on mobile data.',
    problem:
      'The event needed a controlled guest flow across multiple ceremonies, reliable concurrent RSVP writes from family groups submitting at the same time, and a photo gallery that would not become an expensive or unbounded storage liability, all without exposing administrative data or storage credentials.',
    role: 'Frontend, backend, deployment, guest workflow, photo pipeline, and storage infrastructure (Terraform).',
    stack: ['React', 'Vite', 'Express.js', 'Firebase', 'Cloudflare R2', 'Terraform'],
    architecture: {
      title: 'Validated guest flow with a three-version photo pipeline',
      description:
        'The React client validates guest records through the Express API, records RSVP state in Firestore using transactions for concurrent family submissions, and routes every photo upload through a Sharp-based resize step before it lands in a Terraform-provisioned R2 bucket.',
      nodes: [
        { id: 'guest', label: 'Guest', detail: 'Validated browser flow', kind: 'actor' },
        { id: 'client', label: 'React client', detail: 'Vite, RSVP and gallery UI', kind: 'app' },
        { id: 'service', label: 'Express API', detail: 'Validation boundary', kind: 'service' },
        { id: 'firebase', label: 'Firestore', detail: 'Dual SDK, transactional RSVP state', kind: 'data' },
        { id: 'pipeline', label: 'Image pipeline', detail: 'Sharp, 3 versions per photo', kind: 'step' },
        { id: 'storage', label: 'Cloudflare R2', detail: 'Terraform-managed, CORS-scoped', kind: 'data' },
      ],
      edges: [
        { from: 'guest', to: 'client' },
        { from: 'client', to: 'service', label: 'Validated request' },
        { from: 'service', to: 'firebase', label: 'RSVP state (transactional)' },
        { from: 'service', to: 'pipeline', label: 'Photo upload' },
        { from: 'pipeline', to: 'storage', label: 'Original + compressed + thumbnail' },
      ],
    },
    keyFeatures: [
      'Multi-event RSVP across several ceremonies in one form, with per-family attendance tracking',
      'Firestore transactions so two family members RSVPing at the same moment never clobber each other\'s write',
      'Three-version image pipeline (original, 1200px compressed, 300x300 thumbnail) ahead of every R2 upload',
      'Terraform-provisioned R2 bucket with CORS scoped to the production domain and local dev ports only',
    ],
    deployment:
      'The client and Express API deploy as separate production concerns with storage credentials kept server-side. R2 bucket creation, the custom domain, and CORS rules are defined in Terraform rather than clicked together in a dashboard, so the storage layer is reproducible if it ever needs to move.',
    security:
      'Guest validation gates every RSVP and upload action, storage credentials never reach the browser, and the photo pipeline strips and rewrites image metadata during the resize step rather than passing the original file through untouched. The client project remains private.',
    challenges: [
      'Coordinating guest identity with RSVP state across family groups without an account system to anchor it',
      'Keeping concurrent writes consistent when several guests in the same family RSVP within seconds of each other',
      'Sizing the image pipeline so a phone-camera photo and a DSLR export both land at a predictable storage cost',
    ],
    lessons: [
      'Splitting Firestore\'s Client and Admin SDKs by concern (guest data vs. photo data) made the trust boundary explicit instead of implicit',
      'Upload flows need a processing step before storage, not just an access-control check at the door',
      'Private client work can still document real architecture without exposing guest data or the client\'s identity',
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
      'Photo storage costs stayed negligible across the event by compressing every upload before it reached R2, instead of storing originals unprocessed',
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
        { id: 'config', label: 'Environment config', detail: 'Input variables', kind: 'step' },
        { id: 'modules', label: 'Terraform modules', detail: 'Reusable resources', kind: 'service' },
        { id: 'ci', label: 'GitHub Actions', detail: 'Format and validation', kind: 'step' },
        { id: 'aws', label: 'AWS', detail: 'Target infrastructure', kind: 'infra' },
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
        { id: 'source', label: 'Source change', detail: 'Pull request or push', kind: 'actor' },
        { id: 'build', label: 'Build', detail: 'Artifact creation', kind: 'step' },
        { id: 'test', label: 'Test', detail: 'Automated checks', kind: 'step' },
        { id: 'validate', label: 'Validate', detail: 'Release gate', kind: 'step' },
        { id: 'deploy', label: 'Deploy', detail: 'Target environment', kind: 'infra' },
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
      'A reusable security workflow that gives different repository types one consistent scanning entry point. This is Kaji Guard, the security scanner from Kaji Labs. Its own repository is private, but it follows the same labeled-PR workflow pattern as Kaji Labs\' public PR Version Bot.',
    problem:
      'Security checks are often copied between repositories, drift over time, and produce inconsistent results.',
    role: 'Action interface, scan orchestration, failure policy, and developer-facing output.',
    stack: ['GitHub Actions', 'Node.js', 'Docker', 'Terraform'],
    architecture: {
      title: 'Repository-aware scan orchestration',
      description:
        'Repository inputs select relevant frontend, backend, infrastructure, and container checks before results are summarized.',
      nodes: [
        { id: 'repo', label: 'Repository', detail: 'Workflow caller', kind: 'actor' },
        { id: 'action', label: 'Golden action', detail: 'Scan orchestration', kind: 'service' },
        { id: 'scanners', label: 'Security scanners', detail: 'Workload checks', kind: 'step' },
        { id: 'summary', label: 'Job summary', detail: 'Actionable results', kind: 'data' },
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
        label: 'Kaji Labs PR Version Bot (public sibling repo)',
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
        { id: 'targets', label: 'Websites', detail: 'Monitored endpoints', kind: 'infra' },
        { id: 'probe', label: 'Probe', detail: 'Availability checks', kind: 'service' },
        { id: 'metrics', label: 'Prometheus', detail: 'Time-series metrics', kind: 'data' },
        { id: 'grafana', label: 'Grafana', detail: 'Dashboards and SLA views', kind: 'app' },
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

// Fill/stroke per node kind so a diagram visually distinguishes actors,
// apps, services, data stores, infra targets, and pipeline steps instead of
// one uniform box color. Kept inside the design system's existing palette
// (--filament, --signal, --ash, --avocatus) rather than introducing new hues.
const KIND_STYLES: Record<ArchitectureNodeKind, string> = {
  actor: 'fill:#1c1f24,stroke:#94A3B8,color:#E2E8F0',
  app: 'fill:#1a1410,stroke:#FF5F1F,color:#E2E8F0',
  service: 'fill:#0d1014,stroke:#94A3B8,color:#E2E8F0',
  data: 'fill:#10161f,stroke:#4ade80,color:#E2E8F0',
  infra: 'fill:#15120d,stroke:#FF5F1F,color:#E2E8F0',
  step: 'fill:#0e1410,stroke:#2D3E33,color:#E2E8F0',
}

export function buildMermaidFlowchart(architecture: CaseStudy['architecture']): string {
  const nodes = architecture.nodes.map(mermaidLabel)
  const edges = architecture.edges.map((edge) => {
    const label = edge.label ? '|' + edge.label.replace(/"/g, "'") + '|' : ''
    return edge.from + ' -->' + label + ' ' + edge.to
  })
  const kindsUsed = [...new Set(architecture.nodes.map((node) => node.kind))]
  const classDefs = kindsUsed.map((kind) => 'classDef ' + kind + ' ' + KIND_STYLES[kind])
  const classAssignments = kindsUsed.map(
    (kind) => 'class ' + architecture.nodes.filter((node) => node.kind === kind).map((node) => node.id).join(',') + ' ' + kind,
  )
  return ['flowchart LR', ...nodes, ...edges, ...classDefs, ...classAssignments].join('\n')
}

export type SystemsMapEdge = { from: string; to: string; label: string }

// Real cross-project relationships derived from each case study's own stack/
// description above, not placeholder data. Terraform/AWS reuse, the
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
