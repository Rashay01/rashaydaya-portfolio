export function MonolithSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-end gap-3 pb-4">
      {/* Monolith silhouette */}
      <div className="flex-1 w-full flex items-center justify-center">
        <div
          className="skeleton-shimmer rounded-sm"
          style={{
            width: '38%',
            height: '78%',
            minWidth: 64,
            border: '1px solid rgba(148,163,184,0.07)',
          }}
        />
      </div>

      {/* Terminal line placeholders */}
      <div className="w-full flex flex-col gap-1.5 px-2">
        <div className="skeleton-shimmer rounded-sm h-[7px] w-[55%]" />
        <div className="skeleton-shimmer rounded-sm h-[7px] w-[38%]" />
        <div className="skeleton-shimmer rounded-sm h-[7px] w-[46%]" />
      </div>
    </div>
  )
}
