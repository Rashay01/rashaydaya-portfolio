import { afterEach, describe, expect, it, vi } from 'vitest'
import { getLatestPipelineRun } from './live-pipeline'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getLatestPipelineRun', () => {
  it('maps the latest completed run and its jobs', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            workflow_runs: [
              {
                status: 'completed',
                conclusion: 'success',
                html_url: 'https://github.com/Rashay01/rashaydaya-portfolio/actions/runs/1',
                updated_at: '2026-06-22T10:00:00Z',
                head_sha: 'abc123',
                jobs_url: 'https://api.github.com/repos/Rashay01/rashaydaya-portfolio/actions/runs/1/jobs',
              },
            ],
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            jobs: [
              { name: 'Lint', conclusion: 'success' },
              { name: 'Unit Tests', conclusion: 'success' },
            ],
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([{ context: 'tests/vitest', description: '80/80 tests passed' }]),
          { status: 200 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    const run = await getLatestPipelineRun()

    expect(run).toMatchObject({
      conclusion: 'success',
      htmlUrl: 'https://github.com/Rashay01/rashaydaya-portfolio/actions/runs/1',
      jobs: [
        { name: 'Lint', conclusion: 'success' },
        { name: 'Unit Tests', conclusion: 'success' },
      ],
      testSummary: '80/80 tests passed',
    })
  })

  it('returns null instead of throwing when the API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    await expect(getLatestPipelineRun()).resolves.toBeNull()
  })

  it('returns null when GitHub responds with a non-OK status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 403 })))

    await expect(getLatestPipelineRun()).resolves.toBeNull()
  })
})
