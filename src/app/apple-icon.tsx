import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 88,
            color: '#FF5F1F',
            letterSpacing: '-4px',
            lineHeight: 1,
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          }}
        >
          RD
        </span>
      </div>
    ),
    { width: 180, height: 180 },
  )
}
