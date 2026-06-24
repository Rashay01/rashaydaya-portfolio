'use client'

import { useEffect, useId, useRef, useState } from 'react'

export function MermaidDiagram({ definition }: { definition: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const renderId = useId().replace(/:/g, '')
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          darkMode: true,
          background: '#111418',
          primaryColor: '#0d1014',
          primaryTextColor: '#E2E8F0',
          primaryBorderColor: '#94A3B8',
          lineColor: '#FF5F1F',
          secondaryColor: '#0a0f0c',
          tertiaryColor: '#111418',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '13px',
        },
      })
      try {
        const { svg } = await mermaid.render('mermaid-' + renderId, definition)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch {
        if (!cancelled) setFailed(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [definition, renderId])

  if (failed) return null

  return (
    <>
      {loading && (
        <div aria-hidden="true" className="skeleton-shimmer h-64 w-full rounded-sm" />
      )}
      <div
        ref={containerRef}
        aria-hidden="true"
        className={loading ? 'hidden' : '[&_svg]:mx-auto [&_svg]:max-w-full'}
      />
    </>
  )
}
