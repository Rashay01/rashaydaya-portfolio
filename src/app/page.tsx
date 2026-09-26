import type { Metadata } from 'next'
import { SatinCommandNav } from '@/components/nav/SatinCommandNav'
import { BootSequence } from '@/components/sections/BootSequence'
import { ZenithHero } from '@/components/sections/ZenithHero'
import { CapabilityMatrix } from '@/components/sections/CapabilityMatrix'
import { ForgeProjects } from '@/components/sections/ForgeProjects'
import { SignatureFooter } from '@/components/sections/SignatureFooter'
import { KajiLabs } from '@/components/sections/KajiLabs'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { getLatestPipelineRun } from '@/lib/data/live-pipeline'
import { getRecentActivity } from '@/lib/data/github-activity'
import { getCvUpdatedLabel } from '@/lib/data/cv-meta'
import { buildProfilePageSchema } from '@/lib/seo/structured-data'

// Canonical lives here rather than in the root layout: a layout-level
// canonical is inherited by every route that forgets its own, silently
// pointing that page at the homepage and keeping it out of the index.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function Home() {
  const [livePipeline, recentActivity] = await Promise.all([getLatestPipelineRun(), getRecentActivity()])
  const cvUpdatedLabel = getCvUpdatedLabel()

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProfilePageSchema()) }} />
      <BootSequence />
      <SatinCommandNav />

      {/* 1. The Zenith, Hero (Tension) */}
      <ZenithHero cvUpdatedLabel={cvUpdatedLabel} />

      {/* 2. The Forge, Projects (Proof, leads) */}
      <ForgeProjects livePipeline={livePipeline} recentActivity={recentActivity} />

      <KajiLabs />

      {/* 3. The Archive, Skills (Rest) */}
      <CapabilityMatrix livePipeline={livePipeline} />

      <ExperienceTimeline />

      {/* 4. The Signature, Footer (Culmination) */}
      <SignatureFooter livePipeline={livePipeline} />
    </main>
  )
}
