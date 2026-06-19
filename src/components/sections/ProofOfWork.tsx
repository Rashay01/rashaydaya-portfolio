import { SectionHeader } from '@/components/ui/SectionHeader'

const proofItems = [
  'Live platforms',
  'Production deployments',
  'Infrastructure workflows',
  'CI/CD automation',
  'Cloudflare R2 storage',
  'Monitoring dashboards',
  'Technical documentation',
]

export function ProofOfWork() {
  return (
    <section
      id="proof"
      className="bg-obsidian border-t border-ash/10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10"
      aria-labelledby="proof-heading"
    >
      <SectionHeader
        eyebrow="PROOF OF WORK"
        title="Proof of Work."
        description="Signals that matter: shipped platforms, deployment workflows, storage systems, and technical documentation."
        headingId="proof-heading"
      />

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {proofItems.map((item) => (
          <li
            key={item}
            className="flex min-h-[54px] items-center justify-between gap-4 rounded-sm border border-ash/10 bg-card px-4 py-3"
          >
            <span className="text-sm text-satin tracking-[-0.01em]">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  )
}
