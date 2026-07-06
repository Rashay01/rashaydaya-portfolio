import Image from 'next/image'
import Link from 'next/link'
import type { CaseStudy } from '@/lib/data/case-studies'
import { notes } from '@/lib/data/notes'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { TrustMarkers } from './TrustMarkers'
import { TracingBeam } from './TracingBeam'

function TextSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-ash/10 py-10 pl-5 sm:py-14 sm:pl-7">
      <h2 className="font-calsans text-2xl sm:text-4xl text-satin">{title}</h2>
      <div className="mt-5 max-w-3xl text-satin/80 leading-relaxed">{children}</div>
    </section>
  )
}

export function CaseStudyContent({ study }: { study: CaseStudy }) {
  const relatedNote = notes.find((note) => note.relatedCaseStudy === study.slug)

  return (
    <>
      <header className="max-w-4xl pb-14 sm:pb-20">
        <p
          className={`font-mono text-xs uppercase tracking-[0.16em] ${
            study.status === 'In progress' ? 'text-ash' : 'text-filament'
          }`}
        >
          {study.status} / Case study
          {study.status === 'In progress' && ' (evidence pending)'}
        </p>
        <h1
          className="heading-display mt-5"
          style={{ viewTransitionName: `project-title-${study.slug}` } as React.CSSProperties}
        >
          {study.title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-satin/80">{study.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <TrustMarkers markers={study.trustMarkers} />
        </div>
      </header>

      <TracingBeam>
      <TextSection title="Overview">
        <p>{study.overview}</p>
      </TextSection>
      <TextSection title="Problem">
        <p>{study.problem}</p>
      </TextSection>
      <TextSection title="My role">
        <p>{study.role}</p>
      </TextSection>
      <TextSection title="Stack">
        <ul className="flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <li className="tech-pill" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </TextSection>
      <TextSection id="architecture" title="Architecture">
        <ArchitectureDiagram architecture={study.architecture} />
      </TextSection>
      <TextSection title="Key features">
        <ul className="grid gap-3">
          {study.keyFeatures.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </TextSection>
      <TextSection title="Deployment">
        <p>{study.deployment}</p>
      </TextSection>
      {study.results && study.results.length > 0 && (
        <TextSection title="Results">
          <ul className="grid gap-3">
            {study.results.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </TextSection>
      )}
      <TextSection title="Security">
        <p>{study.security}</p>
      </TextSection>
      <TextSection title="Challenges">
        <ul className="grid gap-3">
          {study.challenges.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </TextSection>
      <TextSection title="What I learned">
        <ul className="grid gap-3">
          {study.lessons.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </TextSection>
      <TextSection title="Proof and evidence">
        <div className="grid gap-4 md:grid-cols-2">
          {study.evidence.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-sm border border-ash/15 bg-card">
              {item.image && (
                <div className="relative aspect-[16/10] w-full border-b border-ash/15">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="font-mono text-xs uppercase tracking-wide text-filament">{item.kind}</p>
                <h3 className="mt-2 text-lg text-satin">{item.title}</h3>
                <p className="mt-2 text-sm text-ash">{item.description}</p>
                {item.href && (
                  <a
                    className="mt-4 inline-flex min-h-11 items-center text-sm text-filament"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View verified evidence ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </TextSection>
      <TextSection title="Links">
        <ul className="flex flex-wrap gap-3">
          {study.links.map((link) => (
            <li key={link.href}>
              <a
                className="btn-filament"
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </TextSection>
      {relatedNote && (
        <TextSection title="Related note">
          <Link href={`/notes/${relatedNote.slug}`} className="text-filament hover:text-signal">
            {relatedNote.title}
          </Link>
        </TextSection>
      )}
      </TracingBeam>
    </>
  )
}
