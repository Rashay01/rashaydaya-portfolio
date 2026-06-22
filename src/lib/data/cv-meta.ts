import { statSync } from 'node:fs'
import { join } from 'node:path'

/** Reads the CV PDF's real last-modified date so the hero badge never goes stale. */
export function getCvUpdatedLabel(): string {
  const stats = statSync(join(process.cwd(), 'public/Rashay_Daya_CV.pdf'))
  return stats.mtime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
