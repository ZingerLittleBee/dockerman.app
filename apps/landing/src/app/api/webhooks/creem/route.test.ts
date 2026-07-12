import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import { createHmac } from 'node:crypto'
import { parseJsonRequestBody } from '@/test/parseJsonRequestBody'

const originalFetch = globalThis.fetch
const originalEnv = {
  CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY
}

const WEBHOOK_SECRET = 'creem-test-secret'
const REQUEST_ID = '018f3b4c-5d6e-7f80-9123-a456789bcdef'
const COMPLETED_CHECKOUT =
  '{"id":"evt_test_123","eventType":"checkout.completed","created_at":1783877000000,"object":{"id":"ch_private","request_id":"018f3b4c-5d6e-7f80-9123-a456789bcdef","status":"completed","metadata":{"plan":"3-devices","locale":"zh"},"order":{"id":"ord_private","amount":799,"currency":"USD","status":"paid"},"customer":{"id":"cus_private","name":"Private Person","email":"private@example.com","country":"US"}}}'

process.env.CREEM_WEBHOOK_SECRET = WEBHOOK_SECRET
process.env.NEXT_PUBLIC_POSTHOG_KEY = 'posthog-test-key'

const { POST } = await import('./route')

function signature(body: string) {
  return createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
}

function webhookRequest(body: string, webhookSignature = signature(body)) {
  return new Request('https://dockerman.app/api/webhooks/creem', {
    method: 'POST',
    headers: { 'creem-signature': webhookSignature },
    body
  })
}

beforeEach(() => {
  process.env.CREEM_WEBHOOK_SECRET = WEBHOOK_SECRET
  process.env.NEXT_PUBLIC_POSTHOG_KEY = 'posthog-test-key'
})

afterEach(() => {
  globalThis.fetch = originalFetch
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
})

describe('Creem webhook route', () => {
  test('captures one privacy-safe purchase event from a valid completed checkout', async () => {
    const fetchMock = mock(async () => Response.json({ status: 'ok' }))
    globalThis.fetch = fetchMock

    const response = await POST(webhookRequest(COMPLETED_CHECKOUT))

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('https://us.i.posthog.com/capture/')
    expect(parseJsonRequestBody(fetchMock.mock.calls[0][1]?.body)).toEqual({
      api_key: 'posthog-test-key',
      event: 'purchase_completed',
      properties: {
        distinct_id: REQUEST_ID,
        plan: '3-devices',
        locale: 'zh',
        amount_minor: 799,
        currency: 'USD',
        source: 'website',
        $host: 'dockerman.app',
        $geoip_disable: true,
        $insert_id: `purchase:${REQUEST_ID}`
      }
    })
  })

  test('rejects invalid signatures without sending analytics', async () => {
    const fetchMock = mock(async () => Response.json({ status: 'ok' }))
    globalThis.fetch = fetchMock

    const response = await POST(webhookRequest(COMPLETED_CHECKOUT, 'invalid-signature'))

    expect(response.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('acknowledges unrelated signed events without sending analytics', async () => {
    const fetchMock = mock(async () => Response.json({ status: 'ok' }))
    globalThis.fetch = fetchMock
    const unrelatedEvent = COMPLETED_CHECKOUT.replace(
      '"eventType":"checkout.completed"',
      '"eventType":"subscription.active"'
    )

    const response = await POST(webhookRequest(unrelatedEvent))

    expect(response.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('requests a Creem retry when purchase analytics delivery fails', async () => {
    const fetchMock = mock(async () => new Response(null, { status: 503 }))
    globalThis.fetch = fetchMock

    const response = await POST(webhookRequest(COMPLETED_CHECKOUT))

    expect(response.status).toBe(503)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
