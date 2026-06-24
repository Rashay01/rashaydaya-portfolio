export default function Loading() {
  return (
    <main className="min-h-screen px-4 pb-24 sm:px-6 md:px-10">
      <div className="mx-auto max-w-3xl pt-16">
        <div className="skeleton-shimmer h-4 w-40 rounded-sm" />
        <div className="skeleton-shimmer mt-5 h-10 w-2/3 rounded-sm" />
        <div className="skeleton-shimmer mt-6 h-5 w-full rounded-sm" />
        <div className="mt-16 divide-y divide-ash/10 border-t border-ash/10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 py-7 sm:py-8">
              <div className="skeleton-shimmer h-4 w-32 rounded-sm" />
              <div className="skeleton-shimmer h-7 w-3/4 rounded-sm" />
              <div className="skeleton-shimmer h-4 w-full rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
