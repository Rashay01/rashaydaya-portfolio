// ponytail: hardcoded — fs.statSync doesn't exist in Cloudflare Workers runtime. Update when CV changes.
export function getCvUpdatedLabel(): string {
  return process.env.CV_UPDATED ?? 'September 2026'
}
