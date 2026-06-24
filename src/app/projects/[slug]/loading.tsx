export default function Loading() {
  return (
    <main className="min-h-screen bg-obsidian px-4 sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl pb-24 pt-14 sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-widest text-filament">&gt; LOADING_CASE_STUDY</p>
        <div className="skeleton-shimmer mt-5 h-10 w-2/3 rounded-sm" />
        <div className="skeleton-shimmer mt-6 h-5 w-full rounded-sm" />
        <div className="mt-12 space-y-3">
          <div className="skeleton-shimmer h-4 w-full rounded-sm" />
          <div className="skeleton-shimmer h-4 w-[92%] rounded-sm" />
          <div className="skeleton-shimmer h-4 w-[80%] rounded-sm" />
        </div>
      </div>
    </main>
  )
}
