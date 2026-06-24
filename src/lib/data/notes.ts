// A body block is either a prose paragraph, or a short bullet list for the
// few points worth scanning rather than reading as a sentence (a feature
// set, a list of fixes). Most notes are paragraph-only; lists are used where
// they genuinely help, not on every note.
export type NoteBodyBlock = string | { items: string[] }

export type Note = {
  slug: string
  title: string
  summary: string
  status: 'Planned' | 'Published'
  body: NoteBodyBlock[]
  relatedCaseStudy?: string
  publishedAt: string
}

export const notes: Note[] = [
  {
    slug: 'cloudflare-pages-deploys',
    title: 'How I deploy React apps with Cloudflare Pages',
    summary: 'A practical release path from repository to a verified production deployment.',
    status: 'Published',
    relatedCaseStudy: 'house-of-chai',
    publishedAt: '2026-06-22',
    body: [
      'Cloudflare Pages builds straight from a Git repository, so the release path starts with the branch model: production deploys come from `main`, every other branch gets its own preview URL automatically. That preview URL is the actual review artifact. I link it in the PR instead of describing the change, because a reviewer clicking a live build catches more than a diff does.',
      'The build step itself is just the framework\'s normal production build (`next build` for a static export, or the equivalent for whatever the frontend is). Pages does not need anything framework-specific configured beyond the build command and output directory, so the temptation is to reach for a Cloudflare-specific adapter before checking whether the plain build output already works.',
      'Environment variables split into two groups: build-time variables baked into the static output, and anything secret that the API layer needs, which never goes near the frontend bundle. For House of Chai, the frontend is static on Pages and the Node.js API is a separate Railway service, so keeping that boundary explicit means a frontend redeploy can never accidentally leak a backend credential.',
      'After every deploy I check three things before calling it done: the production URL loads with a 200, the deployed commit hash in the Pages dashboard matches what I expect, and any client-facing form or fetch still hits the right API origin. That last one is the failure mode I have actually hit: a preview deploy quietly pointing at a stale API URL because an environment variable wasn\'t scoped to the right environment.',
    ],
  },
  {
    slug: 'github-actions-ci-cd',
    title: 'How I structure GitHub Actions for CI/CD',
    summary: 'Clear jobs, required checks, permissions, and readable failure states.',
    status: 'Published',
    relatedCaseStudy: 'cicd-pipeline-system',
    publishedAt: '2026-06-22',
    body: [
      'A pipeline should answer "why did it stop?" without anyone opening the raw log. I split workflows into named jobs (build, test, validate, deploy) rather than one long job, because GitHub renders each job as its own pass/fail line. A failing test job reads as "tests failed," not as a wall of text someone has to scroll through.',
      'Every job gets the narrowest `permissions:` block it needs, set explicitly rather than inherited from repository defaults. A job that only runs tests gets `contents: read` and nothing else; only the deploy job gets write access to whatever it\'s deploying to. This is the single change that prevents a compromised or misconfigured action from doing more damage than its job requires.',
      'Deployment is gated behind required status checks on the branch, not behind a manual "did the tests pass?" check before merging. If build or test fails, the deploy job never starts: GitHub Actions\' `needs:` dependency between jobs enforces that ordering for free, so there\'s no manual approval step doing a computer\'s job.',
      'Secrets stay in repository or environment secrets, referenced by name in the workflow YAML, never echoed into logs. For anything touching infrastructure (the Terraform validation workflow is the clearest example) I also pin third-party actions to a commit SHA rather than a tag, since a tag can move underneath you but a SHA can\'t.',
    ],
  },
  {
    slug: 'terraform-reusable-infrastructure',
    title: 'How I use Terraform for reusable infrastructure',
    summary: 'Separating module interfaces, environment inputs, validation, and apply.',
    status: 'Published',
    relatedCaseStudy: 'infrastructure-blueprint-system',
    publishedAt: '2026-06-22',
    body: [
      'The structure that has held up across projects is a clean split between modules and environments: modules describe a resource shape (a VPC, a service, a storage bucket) with inputs and outputs, and environment directories supply the actual values for dev, staging, or prod. The module never hardcodes an environment-specific value; if it does, it stops being reusable the first time a second environment needs something different.',
      'Module interfaces are kept small on purpose. A module with twelve optional variables is harder to review and harder to trust than three small modules composed together. When I\'m tempted to add another flag to a module, that\'s usually the signal that the module is trying to do two things and should split.',
      'Every change goes through `terraform fmt -check` and `terraform validate` in GitHub Actions before a human ever runs `plan`. The plan output itself is the real review artifact: it gets posted as a CI comment so the diff between current and desired infrastructure is visible before anyone approves an apply, the same way a code diff is visible before a merge.',
      'Apply only happens after that explicit approval, with credentials scoped to deployment secrets and never present on a local machine for production environments. The failure I\'m guarding against isn\'t a syntax error (`validate` catches those); it\'s an apply that does something technically valid but operationally surprising, which only a human reading the plan will catch.',
    ],
  },
  {
    slug: 'production-rsvp-platform',
    title: 'How I built a production RSVP platform',
    summary: 'Guest validation, RSVP state, controlled media uploads, and deployment boundaries.',
    status: 'Published',
    relatedCaseStudy: 'event-rsvp-platform',
    publishedAt: '2026-06-22',
    body: [
      'The event RSVP platform had one constraint that shaped everything else: guests needed to respond and upload photos without an account system, but the data still had to be trustworthy enough to plan a real event around. The answer was validating guest records against a known list at the API layer rather than trusting whatever the client submitted. The React client never decides who counts as a valid guest, it just calls a service that does.',
      'RSVP state lives in Firebase, which made sense for write-heavy, loosely structured guest responses without standing up a separate database for a single event. The tradeoff is that Firebase security rules are doing real access-control work, not just convenience, so the rules were written to match the same validation boundary as the API, not left at permissive defaults.',
      'Media uploads were the riskiest part of the brief: guests uploading photos directly to storage is exactly the kind of flow that leaks credentials if done carelessly. Uploads go through the Node.js service, which issues a scoped, short-lived path to Cloudflare R2 rather than handing out storage credentials to the browser. The browser never holds anything it could replay or misuse after the upload completes.',
      'Keeping the client, the validation service, and storage as separate deployable pieces meant a media-handling bug could be fixed and redeployed without touching the guest-facing UI at all, which mattered close to the event date, when the cost of an unrelated regression is much higher than usual.',
    ],
  },
  {
    slug: 'grafana-website-monitoring',
    title: 'How I monitor websites with Grafana',
    summary: 'Turning probes and time-series data into useful uptime and SLA views.',
    status: 'Published',
    relatedCaseStudy: 'monitoring-dashboard',
    publishedAt: '2026-06-24',
    body: [
      'This is still in progress. The probe and Prometheus layer are running; Grafana dashboards and the SLA views below are what I\'m building next, not what\'s shipped yet. Treat this as the plan I\'m executing against, not a finished system.',
      'A site returning a 200 is not the same as a site working well, so the monitoring stack starts one layer below Grafana: a probe checks each target on a schedule and Prometheus stores the result as a time series, not just a current status. Grafana only ever visualizes that history; it has no opinion about uptime, it just renders what Prometheus already recorded.',
      'The metrics that matter for a small set of production sites are availability, response latency, and certificate expiry. Those are the three signals that catch the failure modes I\'ve actually seen: the site is down, the site is up but slow enough to matter, or the site is about to go down because a cert lapsed. Dashboards are built around those three, not around every metric Prometheus happens to expose.',
      'SLA-style views need a defined measurement window before they mean anything. "99.9% uptime" is meaningless without saying over what period, so each dashboard panel states its window explicitly rather than implying "always."',
      'The whole stack runs containerized on a small Linux host, which keeps the monitoring system itself simple enough to not need its own monitoring. Dashboard access stays internal; nothing about the monitoring surface is exposed publicly, since an uptime dashboard is operational tooling, not a feature for site visitors.',
    ],
  },
  {
    slug: 'how-this-site-is-built',
    title: 'How this portfolio is built',
    summary: 'The stack and pipeline behind this site, not a client project.',
    status: 'Published',
    publishedAt: '2026-06-24',
    body: [
      'This site is a Next.js app deployed on Cloudflare Pages, the same release path described in the Cloudflare Pages note: production deploys from `main`, every other branch gets a preview URL. The difference here is there\'s no separate API service to coordinate; everything is one deployable unit.',
      'CI runs through GitHub Actions on every push: lint, type-check, the Vitest unit suite, and the Playwright end-to-end suite, all required checks before a merge to `main` can ship. The same job-per-concern structure from the GitHub Actions note applies here; a failing type-check reads as its own line, not as noise inside a longer build step.',
      'The open-graph image at `/opengraph-image.tsx` and the boot sequence on the homepage both pull from the live GitHub Actions API at request time rather than hardcoding a status. If the CI data is unavailable, they fail closed to a static fallback instead of showing a stale or fabricated result.',
      'Case studies, notes, skills, and project cards are all plain TypeScript data modules (`src/lib/data/`), not a CMS. There\'s no database for content that changes a few times a month, and that keeps every claim on the site easy to check against the source file that produced it.',
    ],
  },
  {
    slug: 'zenmarker-android-assignment-app',
    title: 'How I built ZenMarker, an Android assignment app',
    summary: 'A university project: native Android, a PHP REST layer, and a security fix I came back for years later.',
    status: 'Published',
    publishedAt: '2023-01-23',
    body: [
      'ZenMarker started as a university assignment: an Android app where a lecturer creates assignments and students form or join groups against them. Two roles, one shared workflow, native Java on the client talking to a small PHP backend over OkHttp.',
      'The backend wasn\'t a framework. It was a folder of single-purpose PHP scripts, one per operation, each one connecting to MySQL and returning a plain response the Android client could parse. That sounds crude next to the BFF patterns this site\'s other notes describe, and it was, but it matched the constraint: a shared university web host, no room for a Node process or a deployment pipeline, just PHP files dropped on a server.',
      {
        items: [
          'Lecturer creates an assignment and a course association',
          'Students browse open assignments and either create a group or join one',
          'Group membership and submissions are tracked per assignment, not per student, since marking happens at the group level',
        ],
      },
      'I went back to this repo in 2026, years after the original coursework, and found exactly the kind of bug a first real project tends to have: string-concatenated SQL queries built straight from request parameters, classic injection territory. I rewrote every PHP script to use prepared statements with `mysqli_prepare`, and moved the database credentials out of a committed config file into environment variables. Nothing about the app\'s behavior changed; the fix is invisible to a user and exactly the point.',
    ],
  },
  {
    slug: 'insurance-policy-training-app',
    title: 'How I built an insurance policy app on a Python training course',
    summary: 'A Flask CRUD app from a structured training program: policies, customers, and claims with real status workflows.',
    status: 'Published',
    publishedAt: '2024-03-24',
    body: [
      'This was a training-course project, not freelance or client work: a structured program used a fictional insurance product as the brief, and the deliverable was a working policy management system in Flask. The stack was Flask, Flask-Login, Flask-WTF, and Flask-SQLAlchemy against an Azure-hosted database, with Jinja2 templates and Bootstrap for the UI.',
      'The interesting constraint wasn\'t the CRUD itself, it was the status modeling. A policy doesn\'t get deleted when a customer cancels it; it changes status, because the brief called for keeping full transaction history rather than losing records. A claim moves through a fixed set of states (received, under investigation, declined, approved) instead of a free-text status field, so an invalid transition is a validation error, not a typo that ships.',
      {
        items: [
          'User registration and authentication with Flask-Login',
          'Policy CRUD with status-based soft deletes, not hard deletes',
          'Customer records that can be updated but never deleted, for the same audit-trail reason',
          'Claims that move through a fixed status workflow instead of an open string field',
        ],
      },
      'I documented the REST endpoints in a Postman collection as part of the course deliverable, the same habit I now apply to every API I build, training course or not: if the API isn\'t documented somewhere a reviewer can open without reading the source, it isn\'t really done.',
    ],
  },
  {
    slug: 'student-support-system',
    title: 'How I built a student support system at university',
    summary: 'A group project: React and MUI on the front, Node and SQL on the back, scheduled jobs for reminders, CI from the first sprint.',
    status: 'Published',
    publishedAt: '2022-03-26',
    body: [
      'This was a university group project: a web app for handling academic-dishonesty reports and related student-support workflows, built across a few sprints rather than one submission. The frontend is React with MUI and Syncfusion\'s date/calendar components; the backend is a Node server against a SQL database.',
      'The part I\'d call out is the reminder system. Some of the workflow has deadlines a staff member should not have to track manually, so a background worker (`bree`, running on Node worker threads) checks for due items on a schedule and sends an email through Nodemailer when one comes up, instead of relying on someone remembering to check a list.',
      {
        items: [
          'Login and session handling, separate from the academic-dishonesty reporting flow',
          'A structured report and investigation workflow, not a single freeform form',
          'Scheduled reminder emails for time-sensitive steps, run on worker threads',
        ],
      },
      'CI ran on CircleCI from early in the project, with Codecov tracking coverage on every push. Setting that up in sprint one rather than retrofitting it later meant coverage was a number we watched move, not a target we bolted on before a deadline.',
    ],
  },
  {
    slug: 'swapshop-android-trading-app',
    title: 'How I built SwapShop, an Android item-trading app',
    summary: 'A university project: trade one item for another, with in-app chat and Firebase on the back end.',
    status: 'Published',
    publishedAt: '2022-09-26',
    body: [
      'SwapShop is an Android app for trading items: list something you have, browse what other people are offering, propose a swap instead of a sale. It\'s a different problem from a marketplace app, the unit of value is another item, not a price, so the matching and negotiation flow has to work without money changing hands.',
      'Firebase handles auth, the product listings, and in-app chat between two people negotiating a swap. The accepted-swap and ongoing-swap views are separate screens backed by separate data states, since "browsing" and "tracking a swap you already agreed to" are different enough user needs that collapsing them into one list would have made both worse.',
      {
        items: [
          'Category-based browsing for listed items',
          'In-app chat tied to a specific swap proposal, not a generic inbox',
          'Separate ongoing-swaps and accepted-swaps views once a trade is agreed',
        ],
      },
      'CI ran through GitHub Actions with Codecov reporting on every push, same discipline as the student support system project from the same year. Two different group projects, two different teams, and we still went looking for CI and coverage on both without being told to.',
    ],
  },
  {
    slug: 'zomarchy-threejs-zombie-game',
    title: 'How I built a zombie shooter with Three.js',
    summary: 'A final-year project: scene-graph level design, GLTF models, a 200,000-particle rain effect, and an honest list of what I\'d change.',
    status: 'Published',
    publishedAt: '2022-06-09',
    body: [
      'ZOMARCHY is a first-person zombie shooter built on Three.js and WebGL for a final-year university project: kill every zombie in a level before the timer runs out. The level design follows a scene-graph approach, each level is a camera, lights, and a set of GLTF-loaded objects composed into one structure, rather than a flat list of meshes with no relationship to each other.',
      'A few details took more iteration than the rest. The skybox needed to rotate, which `THREE.TextureLoader` alone didn\'t support, so it\'s built from a `BoxGeometry` with its own image path instead. The minimap uses a second, orthographic camera rendered separately and scissored to the top-right of the screen, after trying to bolt it onto the main camera produced rendering errors that weren\'t worth chasing further. The rain is 200,000 individual particles driven by velocity vectors, with a point light randomized for the lightning flash.',
      {
        items: [
          'Scene-graph level composition: camera, lighting, and GLTF objects per level',
          'Custom rotating skybox built from BoxGeometry, not the default texture loader path',
          'A second orthographic camera for the minimap, rendered and scissored separately from the main view',
          '200,000-particle rain effect driven by per-particle velocity',
        ],
      },
      'The team\'s own retrospective named two things we\'d do differently: split each level\'s classes into its own folder for cleaner separation, and let the player look up and down instead of only left and right. I still think that second one is the right call, a shooter where the camera only yaws is a constraint a tutorial accepts and a player notices immediately.',
    ],
  },
]

export const noteSlugs = notes.map((note) => note.slug)

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug)
}
