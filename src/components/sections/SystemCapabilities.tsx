import { SectionHeader } from '@/components/ui/SectionHeader'

const capabilities = [
  {
    title: 'Ship',
    description: 'Production websites, APIs, dashboards, and full-stack applications.',
  },
  {
    title: 'Automate',
    description: 'CI/CD pipelines, release workflows, versioning, and security checks.',
  },
  {
    title: 'Operate',
    description: 'Cloud infrastructure, deployments, monitoring, and reliability workflows.',
  },
]

export function SystemCapabilities() {
  return (
    <section
      id="capabilities"
      className="bg-obsidian border-t border-ash/10 py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10"
      aria-labelledby="capabilities-heading"
    >
      <SectionHeader
        eyebrow="SYSTEM CAPABILITIES"
        title="System Capabilities."
        description="Practical engineering coverage across delivery, automation, and production operations."
        headingId="capabilities-heading"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {capabilities.map((capability) => (
          <article
            key={capability.title}
            className="rounded-sm border border-ash/10 bg-card p-5 sm:p-6 transition-colors duration-200 hover:border-avocatus/60 hover:bg-card-hover"
          >
            <h3 className="font-calsans text-xl text-satin tracking-[-0.02em]">
              {capability.title}
            </h3>
            <p className="mt-4 text-[14px] leading-[1.65] tracking-[-0.01em] text-ash/85">
              {capability.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
