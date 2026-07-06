'use client'

import { useEffect, useState } from 'react'

export function SystemTray({ lastDeploy }: { lastDeploy?: string }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now)

  return (
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ash">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse motion-reduce:animate-none"
        style={{ boxShadow: '0 0 8px var(--signal-glow)' }}
        aria-hidden="true"
      />
      <span suppressHydrationWarning>CAPE TOWN {time}</span>
      {lastDeploy && <span>DEPLOYED {lastDeploy}</span>}
    </div>
  )
}
