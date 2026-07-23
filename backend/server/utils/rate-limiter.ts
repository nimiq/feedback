import consola from 'consola'

interface RateLimitConfig {
  windowSeconds: number
  maxRequests: number
  keyPrefix?: string
}

type IncrementRateLimit = (key: string, resetTime: number, now: number) => Promise<number>

async function incrementRateLimit(key: string, resetTime: number, now: number): Promise<number> {
  const database = useDrizzle()
  const row = await database.insert(tables.rateLimits).values({
    count: 1,
    key,
    resetTime,
  }).onConflictDoUpdate({
    target: tables.rateLimits.key,
    set: {
      count: sql`${tables.rateLimits.count} + 1`,
    },
  }).returning({ count: tables.rateLimits.count }).get()

  try {
    await database.delete(tables.rateLimits).where(lt(tables.rateLimits.resetTime, now))
  }
  catch (error) {
    consola.warn('Expired rate-limit cleanup failed:', error)
  }

  return row.count
}

/**
 * Check the rate limit for a given identifier using an atomic database counter.
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit status and metadata
 */
export async function checkRateLimit(identifier: string, config: RateLimitConfig, increment: IncrementRateLimit = incrementRateLimit): Promise<{
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter: number
}> {
  const { windowSeconds, maxRequests, keyPrefix = 'rate_limit' } = config
  const now = Math.floor(Date.now() / 1000)
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds
  const rateLimitKey = `${keyPrefix}:${identifier}:${windowStart}`
  const resetTime = windowStart + windowSeconds

  try {
    const count = await increment(rateLimitKey, resetTime, now)
    const allowed = count <= maxRequests

    return {
      allowed,
      remaining: Math.max(maxRequests - count, 0),
      resetTime,
      retryAfter: allowed ? 0 : Math.max(resetTime - now, 0),
    }
  }
  catch (error) {
    consola.error('Rate limit check failed:', error)
    // Fail open - allow request if KV is unavailable
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowSeconds,
      retryAfter: 0,
    }
  }
}
