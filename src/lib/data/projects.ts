export type TerminalLine = {
  status: 'ok' | 'run' | 'info' | 'pass'
  text: string
}

export type ProjectData = {
  id: string
  codename: string
  title: string
  description: string
  metric: { value: string; label: string }
  secondMetric?: { value: string; label: string }
  techStack: string[]
  size: 'featured' | 'medium' | 'small'
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
  architectureUrl?: string
  built: string
  statusLabel: 'Live' | 'In progress' | 'Case study available'
  role: string
  codeLabel?: 'GitHub' | 'Code Private'
  caseStudyLabel?: 'Case Study' | 'Case Study Available'
  terminal: {
    label: string
    status: 'LIVE' | 'STABLE' | 'DEPLOYED'
    lines: TerminalLine[]
    stats: { label: string; value: string }[]
  }
}

export const projects: ProjectData[] = [
  {
    id: 'wedding-platform',
    codename: 'PROJECT RSVP',
    title: 'Event RSVP & Media Platform',
    description: 'Full-stack RSVP and media platform with guest validation, RSVP flows, and upload storage using Firebase and Cloudflare R2.',
    metric: { value: '200+', label: 'GUEST RECORDS' },
    secondMetric: { value: 'Cloudflare R2', label: 'STORAGE' },
    techStack: ['React', 'Firebase', 'Cloudflare R2', 'Node.js'],
    size: 'featured',
    liveUrl: 'https://www.marrying-maharaj.co.za/',
    caseStudyUrl: '/projects/event-rsvp-platform',
    architectureUrl: '/projects/event-rsvp-platform#architecture',
    built: '2026',
    statusLabel: 'Live',
    role: 'Frontend, backend, deployment, storage',
    codeLabel: 'Code Private',
    caseStudyLabel: 'Case Study Available',
    terminal: {
      label: 'RSVP SYSTEM',
      status: 'LIVE',
      lines: [
        { status: 'run', text: '[INIT] Starting event platform services...' },
        { status: 'ok',  text: '[OK] Firebase auth initialized' },
        { status: 'ok',  text: '[OK] Cloudflare R2 storage connected' },
        { status: 'run', text: '[RSVP] Processing guest validation...' },
        { status: 'info', text: '  ▸ Guest record: validated' },
        { status: 'info', text: '  ▸ Upload token: issued' },
        { status: 'ok',  text: '[OK] Media upload linked to Cloudflare R2 storage' },
        { status: 'run', text: '[FEED] Syncing interactions...' },
        { status: 'pass', text: '[DONE] Platform live. 0 errors.' },
      ],
      stats: [
        { label: 'GUEST RECORDS', value: '200+' },
        { label: 'STORAGE', value: 'Cloudflare R2' },
        { label: 'ACCESS', value: 'Private client' },
      ],
    },
  },
  {
    id: 'infra-blueprints',
    codename: 'PROJECT TERRA',
    title: 'Infrastructure Blueprint System',
    description: 'Reusable infrastructure blueprint system built with Terraform, AWS, GitHub Actions, and Bash.',
    metric: { value: '4', label: 'REUSABLE MODULES' },
    techStack: ['Terraform', 'AWS', 'GitHub Actions', 'Bash'],
    size: 'medium',
    caseStudyUrl: '/projects/infrastructure-blueprint-system',
    architectureUrl: '/projects/infrastructure-blueprint-system#architecture',
    built: '2026',
    statusLabel: 'Case study available',
    role: 'Infrastructure and automation',
    codeLabel: 'Code Private',
    caseStudyLabel: 'Case Study Available',
    terminal: {
      label: 'TERRAFORM',
      status: 'STABLE',
      lines: [
        { status: 'run', text: '$ terraform init' },
        { status: 'ok',  text: '[OK] Provider plugins loaded' },
        { status: 'run', text: '$ terraform validate' },
        { status: 'ok',  text: '[OK] Configuration valid' },
        { status: 'run', text: '$ terraform apply -auto-approve' },
        { status: 'pass', text: '[DONE] 4 modules applied. 0 errors.' },
      ],
      stats: [
        { label: 'MODULES', value: '4' },
        { label: 'ENVIRONMENTS', value: '3' },
        { label: 'VALIDATION', value: 'Automated' },
      ],
    },
  },
  {
    id: 'house-of-chai',
    codename: 'PROJECT CHAI',
    title: 'The House of Chai Platform',
    description: 'Production web platform for a hospitality brand, built with React, Cloudflare Pages, Node.js, and Railway.',
    metric: { value: 'LIVE', label: 'STATUS' },
    techStack: ['React', 'Node.js', 'Cloudflare Pages', 'Railway'],
    size: 'medium',
    liveUrl: 'https://www.thehouseofchai.co.za/',
    caseStudyUrl: '/projects/house-of-chai',
    architectureUrl: '/projects/house-of-chai#architecture',
    built: '2026',
    statusLabel: 'Live',
    role: 'Frontend, backend, deployment',
    codeLabel: 'Code Private',
    caseStudyLabel: 'Case Study Available',
    terminal: {
      label: 'DEPLOY',
      status: 'DEPLOYED',
      lines: [
        { status: 'run', text: '$ npm run build' },
        { status: 'ok',  text: '[OK] Build complete. 0 warnings' },
        { status: 'run', text: '[CF] Deploying to Cloudflare Pages...' },
        { status: 'ok',  text: '[OK] Frontend deployed' },
        { status: 'run', text: '[RW] Deploying API to Railway...' },
        { status: 'pass', text: '[DONE] Platform live. Health check: OK' },
      ],
      stats: [
        { label: 'BUILD TIME', value: '01m 28s' },
        { label: 'FRONTEND', value: 'CF Pages' },
        { label: 'BACKEND', value: 'Railway' },
      ],
    },
  },
  {
    id: 'vanguard-pipeline',
    codename: 'PROJECT OBSIDIAN',
    title: 'CI/CD Pipeline System',
    description: 'Automated delivery workflow using GitHub Actions for build, test, validation, and deployment.',
    metric: { value: 'CI/CD', label: 'DELIVERY FLOW' },
    techStack: ['GitHub Actions', 'AWS', 'Terraform', 'Bash'],
    size: 'small',
    caseStudyUrl: '/projects/cicd-pipeline-system',
    architectureUrl: '/projects/cicd-pipeline-system#architecture',
    built: '2026',
    statusLabel: 'In progress',
    role: 'Automation and deployment',
    codeLabel: 'Code Private',
    caseStudyLabel: 'Case Study Available',
    terminal: {
      label: 'AUTO-DEPLOY',
      status: 'LIVE',
      lines: [
        { status: 'run', text: '[14:23:01] INIT pipeline...' },
        { status: 'ok',  text: '[14:23:02] Artifact hash validated: a7f9b2c' },
        { status: 'run', text: '[14:23:05] Running integration tests...' },
        { status: 'pass', text: '[14:23:22] 42 tests passed. 0 failed.' },
        { status: 'ok',  text: '[14:23:23] Traffic switched. Deploy complete.' },
      ],
      stats: [
        { label: 'BUILD TIME', value: '01m 52s' },
        { label: 'TESTS', value: '42 / 42' },
        { label: 'GATE', value: 'Required checks' },
      ],
    },
  },
]
