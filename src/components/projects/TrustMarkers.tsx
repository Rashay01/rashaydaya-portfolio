import type { TrustMarker } from '@/lib/data/case-studies'
export function TrustMarkers({ markers }: { markers: TrustMarker[] }) {
  return <ul className="flex flex-wrap gap-2" aria-label="Project trust markers">{markers.map((marker) => <li key={marker.label}>{marker.href ? <a href={marker.href} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ash/20 px-3 font-mono text-xs uppercase tracking-wide text-satin hover:border-filament">{marker.label}{marker.verifiedAt && <span className="text-ash/70">· Verified {marker.verifiedAt}</span>}</a> : <span className="inline-flex min-h-11 items-center rounded-full border border-ash/15 px-3 font-mono text-xs uppercase tracking-wide text-ash">{marker.label}</span>}</li>)}</ul>
}
