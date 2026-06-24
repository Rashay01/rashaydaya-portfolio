import { ImageResponse } from 'next/og'
import { getLatestPipelineRun } from '@/lib/data/live-pipeline'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function hoursAgo(iso: string) {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000)
  return hours <= 0 ? 'just now' : hours === 1 ? '1h ago' : `${hours}h ago`
}

async function getCiLine() {
  const run = await getLatestPipelineRun()
  if (!run) return 'DevOps & Full Stack Developer'
  const status = run.conclusion === 'success' ? 'passing' : run.conclusion ?? 'unknown'
  return `CI: ${status} · deployed ${hoursAgo(run.updatedAt)}`
}

export default async function OGImage() {
  const ciLine = await getCiLine()
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111418',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            color: '#FF5F1F',
            fontSize: 24,
            fontFamily: 'monospace',
            marginBottom: 16,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          rashaydaya.co.za
        </div>
        <div
          style={{
            color: '#E2E8F0',
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Rashay Daya
        </div>
        <div
          style={{
            color: '#94A3B8',
            fontSize: 28,
          }}
        >
          {ciLine}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 80,
            color: '#94A3B8',
            fontSize: 18,
            fontFamily: 'monospace',
            opacity: 0.6,
          }}
        >
          Cape Town, Western Cape
        </div>
      </div>
    ),
    { ...size }
  )
}
