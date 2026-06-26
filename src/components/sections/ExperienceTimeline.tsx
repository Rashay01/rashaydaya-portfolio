import { experienceEntries } from '@/lib/data/experience'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function ExperienceTimeline() {
  return <section id="experience" className="border-t border-ash/10 px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32" aria-labelledby="experience-heading">
    <SectionHeader eyebrow="EXPERIENCE" title="Work, shipped." description="A practical timeline of current focus, client delivery, and engineering systems." headingId="experience-heading" />
    <ol className="mx-auto max-w-5xl border-l border-ash/20">{experienceEntries.map((entry) => <li key={entry.title} className="relative pb-12 pl-7 last:pb-0 sm:pl-12"><span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-filament bg-obsidian"/><p className="font-mono text-[10px] uppercase tracking-widest text-filament">{entry.kind}</p><h3 className="mt-2 font-calsans text-2xl text-satin">{entry.title}</h3><p className="mt-3 max-w-3xl text-ash">{entry.description}</p><ul className="mt-4 flex flex-wrap gap-2">{entry.technologies.map((item) => <li key={item} className="tech-pill">{item}</li>)}</ul><p className="mt-5 text-sm text-satin/75">Shipped: {entry.shipped.join(' · ')}</p></li>)}</ol>
  </section>
}
