import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f1928',
          borderRadius: 4,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 15,
            color: '#FF5F1F',
            letterSpacing: '-0.5px',
            lineHeight: 1,
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          }}
        >
          RD
        </span>
      </div>
    ),
    { width: 32, height: 32 },
  )
}
