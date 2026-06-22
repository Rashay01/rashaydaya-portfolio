export const CONTACT_RATE_LIMIT = {
  requests: 5,
  windowMs: 10 * 60 * 1000,
} as const

type RateLimitWindow = {
  count: number
  startedAt: number
}

const windows = new Map<string, RateLimitWindow>()

export function checkContactRateLimit(
  key: string,
  now = Date.now(),
): { allowed: boolean; retryAfter: number } {
  const current = windows.get(key)

  if (!current || now - current.startedAt >= CONTACT_RATE_LIMIT.windowMs) {
    windows.set(key, { count: 1, startedAt: now })
    pruneExpiredWindows(now)
    return { allowed: true, retryAfter: 0 }
  }

  if (current.count >= CONTACT_RATE_LIMIT.requests) {
    return {
      allowed: false,
      retryAfter: Math.ceil(
        (CONTACT_RATE_LIMIT.windowMs - (now - current.startedAt)) / 1000,
      ),
    }
  }

  current.count += 1
  return { allowed: true, retryAfter: 0 }
}

function pruneExpiredWindows(now: number): void {
  if (windows.size < 500) return

  for (const [key, window] of windows) {
    if (now - window.startedAt >= CONTACT_RATE_LIMIT.windowMs) {
      windows.delete(key)
    }
  }
}
