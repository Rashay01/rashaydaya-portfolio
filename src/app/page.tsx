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

export default async function Home() {
  const [livePipeline, recentActivity] = await Promise.all([getLatestPipelineRun(), getRecentActivity()])
  const cvUpdatedLabel = getCvUpdatedLabel()

  return (
    <main id="main">
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
