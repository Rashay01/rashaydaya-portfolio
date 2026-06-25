import Image from 'next/image'
import Link from 'next/link'
import { kajiLabsBuilds, kajiLabsCategoryOrder } from '@/lib/data/kaji-labs'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function KajiLabs() {
  const categories = kajiLabsCategoryOrder
    .map((category) => ({ category, builds: kajiLabsBuilds.filter((b) => b.category === category) }))
    .filter((group) => group.builds.length > 0)

  return (
    <section
      id="kaji-labs"
      className="border-t border-ash/10 px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32"
      aria-labelledby="kaji-labs-heading"
    >
      <SectionHeader
        title="Open-source DevOps tooling."
        description="Kaji Labs is my open-source org for reusable DevOps tooling, built and maintained outside client and personal projects."
        headingId="kaji-labs-heading"
      />
      {categories.map(({ category, builds }) => (
        <div key={category} className="mt-10 first:mt-12">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-filament">{category}</p>
          <div className="mt-4 grid gap-px overflow-hidden rounded-sm border border-ash/10 bg-ash/10 md:grid-cols-2">
            {builds.map((item, index) => {
              const body = (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-filament">
                    0{index + 1} / {item.status}
                  </p>
                  <h3 className="mt-8 font-calsans text-2xl text-satin">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ash">{item.description}</p>
                  {item.href ? (
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.08em] text-ash/80">
                      github.com/kaji-labs/{item.title.toLowerCase().replace(/\s+/g, '-')} ↗
                    </p>
                  ) : (
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.08em] text-ash/60">
                      &gt; ACCESS DENIED: repository private
                      {item.caseStudySlug && ', case study available'}
                    </p>
                  )}
                </>
              )

              const imagePanel = item.image ? (
                <div className="relative hidden md:block border-l border-ash/10 aspect-video">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    loading="eager"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover opacity-80"
                  />
                </div>
              ) : null

              const colSpan = item.image ? 'md:col-span-2 md:grid md:grid-cols-2' : ''

              if (!item.href) {
                return item.caseStudySlug ? (
                  <Link
                    key={item.title}
                    href={`/projects/${item.caseStudySlug}`}
                    className={`bg-card transition-colors duration-200 hover:bg-card-hover ${colSpan}`}
                  >
                    <div className="p-6 sm:p-8">{body}</div>
                    {imagePanel}
                  </Link>
                ) : (
                  <div key={item.title} className={`bg-card ${colSpan}`}>
                    <div className="p-6 sm:p-8">{body}</div>
                    {imagePanel}
                  </div>
                )
              }

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-card transition-colors duration-200 hover:bg-card-hover ${colSpan}`}
                >
                  <div className="p-6 sm:p-8">{body}</div>
                  {imagePanel}
                </a>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
