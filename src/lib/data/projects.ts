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
    description: 'Full-stack event platform with RSVP management, guest validation, and media sharing. Built to handle real-world event traffic with concurrent users and interactive engagement.',
    metric: { value: '200+', label: 'GUEST RECORDS' },
    secondMetric: { value: 'R2', label: 'STORAGE' },
    techStack: ['REACT', 'FIREBASE', 'CLOUDFLARE R2', 'NODE.JS'],
    size: 'featured',
    liveUrl: 'https://www.marrying-maharaj.co.za/',
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
        { status: 'ok',  text: '[OK] Media upload linked to guest record' },
        { status: 'run', text: '[FEED] Syncing interactions...' },
        { status: 'pass', text: '[DONE] Platform live. 0 errors.' },
      ],
      stats: [
        { label: 'GUEST RECORDS', value: '200+' },
        { label: 'STORAGE', value: 'Cloudflare R2' },
        { label: 'UPTIME', value: '99.5%' },
      ],
    },
  },
  {
    id: 'infra-blueprints',
    codename: 'PROJECT TERRA',
    title: 'Infrastructure Blueprint System',
    description: 'Reusable Terraform modules and infrastructure blueprints to standardize deployments across environments. Focused on reducing configuration complexity and improving consistency.',
    metric: { value: '4', label: 'REUSABLE MODULES' },
    techStack: ['TERRAFORM', 'AWS', 'GITHUB ACTIONS', 'BASH'],
    size: 'medium',
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
        { label: 'DEPLOY TIME', value: '< 2 MIN' },
      ],
    },
  },
  {
    id: 'house-of-chai',
    codename: 'PROJECT CHAI',
    title: 'The House of Chai Platform',
    description: 'Production web platform with decoupled frontend and backend architecture. Built for performance, smooth interactions, and reliable deployment via Cloudflare Pages and Railway.',
    metric: { value: 'LIVE', label: 'STATUS' },
    techStack: ['REACT', 'NODE.JS', 'CLOUDFLARE PAGES', 'RAILWAY'],
    size: 'medium',
    liveUrl: 'https://www.thehouseofchai.co.za/',
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
    description: 'Automated delivery pipeline with zero-downtime deployments. GitHub Actions workflows orchestrating build, test, and release across environments.',
    metric: { value: '< 2 MIN', label: 'DEPLOY TIME' },
    techStack: ['GITHUB ACTIONS', 'AWS', 'TERRAFORM', 'BASH'],
    size: 'small',
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
        { label: 'UPTIME', value: '99.5%' },
      ],
    },
  },
]
