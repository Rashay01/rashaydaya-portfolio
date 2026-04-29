import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          DevOps & Full Stack Developer
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
          Johannesburg, South Africa
        </div>
      </div>
    ),
    { ...size }
  )
}
