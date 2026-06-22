import { currentBuilds } from '@/lib/data/current-builds'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function CurrentlyBuilding() {
  return <section id="building" className="border-t border-ash/10 px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32" aria-labelledby="building-heading">
    <SectionHeader eyebrow="ACTIVE WORK" title="Currently Building." description="Systems moving from working foundations toward publishable proof." headingId="building-heading" />
    <div className="grid gap-px overflow-hidden rounded-sm border border-ash/10 bg-ash/10 md:grid-cols-3">{currentBuilds.map((item, index) => <article key={item.title} className="bg-card p-6 sm:p-8"><p className="font-mono text-[10px] uppercase tracking-widest text-filament">0{index + 1} / In progress</p><h3 className="mt-8 font-calsans text-2xl text-satin">{item.title}</h3><p className="mt-4 text-sm leading-relaxed text-ash">{item.description}</p></article>)}</div>
  </section>
}
