export default function Loading() {
  return (
    <main className="min-h-screen px-4 pb-24 sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl pt-16">
        <div className="skeleton-shimmer h-4 w-32 rounded-sm" />
        <div className="skeleton-shimmer mt-5 h-10 w-2/3 rounded-sm" />
        <div className="skeleton-shimmer mt-6 h-5 w-full max-w-2xl rounded-sm" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-56 rounded-sm" />
          ))}
        </div>
      </div>
    </main>
  )
}
