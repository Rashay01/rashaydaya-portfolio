import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArchitectureDiagram } from '@/components/projects/ArchitectureDiagram'
import { TrustMarkers } from '@/components/projects/TrustMarkers'
import { caseStudySlugs, getCaseStudy } from '@/lib/data/case-studies'

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return caseStudySlugs.map((slug) => ({ slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug)
  if (!study) return {}
  return { title: study.title + ' | Rashay Daya', description: study.summary, alternates: { canonical: '/projects/' + study.slug } }
}
function TextSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="border-t border-ash/10 py-10 sm:py-14"><h2 className="font-calsans text-2xl sm:text-4xl text-satin">{title}</h2><div className="mt-5 max-w-3xl text-satin/80 leading-relaxed">{children}</div></section>
}
export default async function ProjectCaseStudy({ params }: Props) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()
  return (
    <main id="main" className="min-h-screen bg-obsidian px-4 sm:px-6 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-5"><a href="/" className="logo-mark text-sm">RASHAY</a><a href="/#forge" className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-wider text-ash hover:text-satin">All projects</a></nav>
      <article className="mx-auto max-w-6xl pb-24 pt-14 sm:pt-20">
        <header className="max-w-4xl pb-14 sm:pb-20"><p className="font-mono text-xs uppercase tracking-[0.16em] text-filament">{study.status} / Case study</p><h1 className="heading-display mt-5">{study.title}</h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-satin/80">{study.summary}</p><div className="mt-8"><TrustMarkers markers={study.trustMarkers} /></div></header>
        <TextSection title="Overview"><p>{study.overview}</p></TextSection>
        <TextSection title="Problem"><p>{study.problem}</p></TextSection>
        <TextSection title="My role"><p>{study.role}</p></TextSection>
        <TextSection title="Stack"><ul className="flex flex-wrap gap-2">{study.stack.map((item) => <li className="tech-pill" key={item}>{item}</li>)}</ul></TextSection>
        <TextSection id="architecture" title="Architecture"><ArchitectureDiagram architecture={study.architecture} /></TextSection>
        <TextSection title="Key features"><ul className="grid gap-3">{study.keyFeatures.map((item) => <li key={item}>• {item}</li>)}</ul></TextSection>
        <TextSection title="Deployment"><p>{study.deployment}</p></TextSection>
        <TextSection title="Security"><p>{study.security}</p></TextSection>
        <TextSection title="Challenges"><ul className="grid gap-3">{study.challenges.map((item) => <li key={item}>• {item}</li>)}</ul></TextSection>
        <TextSection title="What I learned"><ul className="grid gap-3">{study.lessons.map((item) => <li key={item}>• {item}</li>)}</ul></TextSection>
        <TextSection title="Proof and evidence"><div className="grid gap-4 md:grid-cols-2">{study.evidence.map((item) => <div key={item.title} className="rounded-sm border border-ash/15 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-wider text-filament">{item.kind}</p><h3 className="mt-2 text-lg text-satin">{item.title}</h3><p className="mt-2 text-sm text-ash">{item.description}</p>{item.href && <a className="mt-4 inline-flex min-h-11 items-center text-sm text-filament" href={item.href} target="_blank" rel="noreferrer">View verified evidence ↗</a>}</div>)}</div></TextSection>
        <TextSection title="Links"><ul className="flex flex-wrap gap-3">{study.links.map((link) => <li key={link.href}><a className="btn-filament" href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>{link.label}</a></li>)}</ul></TextSection>
      </article>
    </main>
  )
}
