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

export default async function Home() {
  const livePipeline = await getLatestPipelineRun()

  return (
    <main id="main">
      <SatinCommandNav />

      {/* 1. The Zenith — Hero (Tension) */}
      <ZenithHero />

      {/* 2. The Archive — Skills (Rest) */}
      <ArchiveGrid />

      <SystemCapabilities />

      {/* 3. The Forge — Projects (Tension) */}
      <ForgeProjects livePipeline={livePipeline} />

      <ProofOfWork />

      <KajiLabs />

      <ExperienceTimeline />

      {/* 4. The Signature — Footer (Culmination) */}
      <SignatureFooter />
    </main>
  )
}
