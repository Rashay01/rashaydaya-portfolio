import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// ponytail: default in-memory incremental cache, no R2 bucket. Upgrade to
// r2IncrementalCache if GitHub-data fetch revalidation needs to survive
// across Worker instances.
export default defineCloudflareConfig()
