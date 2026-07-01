export type PipelineJob = {
  name: string
  conclusion: string | null
}

export type PipelineRun = {
  status: string
  conclusion: string | null
  htmlUrl: string
  updatedAt: string
  jobs: PipelineJob[]
  testSummary: string | null
}

export const REPO = 'Rashay01/rashaydaya-portfolio'

async function fetchTestSummary(headSha: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/commits/${headSha}/statuses`, {
    headers: ghHeaders(),
    next: { revalidate: 1800 },
  })
  if (!res.ok) return null

  const statuses = await res.json()
  const testStatus = statuses.find((s: { context: string }) => s.context === 'tests/vitest')
  return testStatus?.description ?? null
}

function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  return token
    ? { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` }
    : { Accept: 'application/vnd.github+json' }
}

export async function getLatestPipelineRun(): Promise<PipelineRun | null> {
  try {
    const runsRes = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/ci.yml/runs?per_page=1&status=completed`,
      { headers: ghHeaders(), next: { revalidate: 1800 } },
    )
    if (!runsRes.ok) return null

    const runsData = await runsRes.json()
    const run = runsData.workflow_runs?.[0]
    if (!run) return null

    const [jobsRes, testSummary] = await Promise.all([
      fetch(run.jobs_url, { headers: ghHeaders(), next: { revalidate: 1800 } }),
      fetchTestSummary(run.head_sha),
    ])
    const jobsData = jobsRes.ok ? await jobsRes.json() : { jobs: [] }

    return {
      status: run.status,
      conclusion: run.conclusion,
      htmlUrl: run.html_url,
      updatedAt: run.updated_at,
      jobs: (jobsData.jobs ?? []).map((job: { name: string; conclusion: string | null }) => ({
        name: job.name,
        conclusion: job.conclusion,
      })),
      testSummary,
    }
  } catch {
    return null
  }
}
