import { SatinCommandNav } from '@/components/nav/SatinCommandNav'
import { ZenithHero } from '@/components/sections/ZenithHero'
import { ArchiveGrid } from '@/components/sections/ArchiveGrid'
import { SystemCapabilities } from '@/components/sections/SystemCapabilities'
import { ForgeProjects } from '@/components/sections/ForgeProjects'
import { ProofOfWork } from '@/components/sections/ProofOfWork'
import { SignatureFooter } from '@/components/sections/SignatureFooter'

export default function Home() {
  return (
    <main id="main">
      <SatinCommandNav />

      {/* 1. The Zenith — Hero (Tension) */}
      <ZenithHero />

      {/* 2. The Archive — Skills (Rest) */}
      <ArchiveGrid />

      <SystemCapabilities />

      {/* 3. The Forge — Projects (Tension) */}
      <ForgeProjects />

      <ProofOfWork />

      {/* 4. The Signature — Footer (Culmination) */}
      <SignatureFooter />
    </main>
  )
}
