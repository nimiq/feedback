import { expect, it } from 'vitest'
import { checkRateLimit } from './rate-limiter'

it('allows only the configured number of concurrent requests', async () => {
  let count = 0
  const increment = async () => ++count

  const requests = []
  for (let request = 0; request < 6; request++) {
    requests.push(checkRateLimit('203.0.113.10', {
      maxRequests: 5,
      windowSeconds: 300,
    }, increment))
  }
  const results = await Promise.all(requests)

  expect(results.filter(result => result.allowed)).toHaveLength(5)
  expect(results.at(-1)?.allowed).toBe(false)
})
