import { SatinCommandNav } from '@/components/nav/SatinCommandNav'
import { ZenithHero } from '@/components/sections/ZenithHero'
import { ArchiveGrid } from '@/components/sections/ArchiveGrid'
import { SystemCapabilities } from '@/components/sections/SystemCapabilities'
import { ForgeProjects } from '@/components/sections/ForgeProjects'
import { ProofOfWork } from '@/components/sections/ProofOfWork'
import { SignatureFooter } from '@/components/sections/SignatureFooter'
import { KajiLabs } from '@/components/sections/KajiLabs'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { getLatestPipelineRun } from '@/lib/data/live-pipeline'
import { getCvUpdatedLabel } from '@/lib/data/cv-meta'

export default async function Home() {
  const livePipeline = await getLatestPipelineRun()
  const cvUpdatedLabel = getCvUpdatedLabel()

  return (
    <main id="main">
      <SatinCommandNav />

      {/* 1. The Zenith — Hero (Tension) */}
      <ZenithHero cvUpdatedLabel={cvUpdatedLabel} />

      {/* 2. The Forge — Projects (Proof, leads) */}
      <ForgeProjects livePipeline={livePipeline} />

      <ProofOfWork />

      <KajiLabs />

      {/* 3. The Archive — Skills (Rest) */}
      <ArchiveGrid />

      <SystemCapabilities />

      <ExperienceTimeline />

      {/* 4. The Signature — Footer (Culmination) */}
      <SignatureFooter />
    </main>
  )
}
