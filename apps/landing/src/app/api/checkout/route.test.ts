import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import { NextRequest } from 'next/server'
import { parseJsonRequestBody } from '@/test/parseJsonRequestBody'

const originalFetch = globalThis.fetch
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const originalEnv = {
  CREEM_API_KEY: process.env.CREEM_API_KEY,
  CREEM_PRODUCT_ID_1_DEVICES: process.env.CREEM_PRODUCT_ID_1_DEVICES,
  CREEM_PRODUCT_ID_3_DEVICES: process.env.CREEM_PRODUCT_ID_3_DEVICES,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY
}

process.env.CREEM_API_KEY = 'creem-test-key'
process.env.CREEM_PRODUCT_ID_1_DEVICES = 'prod_one_device'
process.env.CREEM_PRODUCT_ID_3_DEVICES = 'prod_three_devices'

const { GET, POST } = await import('./route')

function checkoutRequest(method: 'GET' | 'POST', plan = '1-device', locale = 'en') {
  return new NextRequest(`https://dockerman.app/api/checkout?plan=${plan}&locale=${locale}`, {
    method
  })
}

beforeEach(() => {
  process.env.CREEM_API_KEY = 'creem-test-key'
  process.env.CREEM_PRODUCT_ID_1_DEVICES = 'prod_one_device'
  process.env.CREEM_PRODUCT_ID_3_DEVICES = 'prod_three_devices'
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

describe('checkout route', () => {
  test('does not create checkout sessions from GET requests', () => {
    const fetchMock = mock(async () => Response.json({ checkout_url: 'https://checkout.test/pay' }))
    globalThis.fetch = fetchMock

    const response = GET()

    expect(response.status).toBe(405)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('redirects POST requests to checkout with GET semantics', async () => {
    const fetchMock = mock(async () => Response.json({ checkout_url: 'https://checkout.test/pay' }))
    globalThis.fetch = fetchMock

    const response = await POST(checkoutRequest('POST'))

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('https://checkout.test/pay')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toBe('https://test-api.creem.io/v1/checkouts')
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST')
    expect(fetchMock.mock.calls[1][0]).toBe('https://us.i.posthog.com/capture/')

    const creemBody = parseJsonRequestBody(fetchMock.mock.calls[0][1]?.body)
    const requestId = creemBody.request_id
    expect(typeof requestId).toBe('string')
    if (typeof requestId !== 'string') {
      throw new Error('Expected an opaque Creem request ID')
    }
    expect(requestId).toMatch(UUID_PATTERN)
    expect(creemBody.metadata).toEqual({ plan: '1-device', locale: 'en' })
    expect(creemBody.success_url).toBe(
      `https://dockerman.app/en/pricing/success?transaction_id=${requestId}&plan=1-device`
    )

    expect(parseJsonRequestBody(fetchMock.mock.calls[1][1]?.body)).toEqual({
      api_key: 'posthog-test-key',
      event: 'checkout_redirected',
      properties: {
        distinct_id: requestId,
        plan: '1-device',
        locale: 'en',
        source: 'website',
        $host: 'dockerman.app',
        $geoip_disable: true
      }
    })
  })

  test('keeps the checkout redirect when analytics delivery fails', async () => {
    const fetchMock = mock((input: string | URL | Request) => {
      if (input === 'https://test-api.creem.io/v1/checkouts') {
        return Promise.resolve(Response.json({ checkout_url: 'https://checkout.test/pay' }))
      }

      return Promise.reject(new Error('PostHog unavailable'))
    })
    globalThis.fetch = fetchMock

    const response = await POST(checkoutRequest('POST'))

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('https://checkout.test/pay')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  test('normalizes untrusted locale values before sending them to external services', async () => {
    const fetchMock = mock(async () => Response.json({ checkout_url: 'https://checkout.test/pay' }))
    globalThis.fetch = fetchMock

    const response = await POST(checkoutRequest('POST', '1-device', 'private@example.com'))

    expect(response.status).toBe(303)
    const creemBody = parseJsonRequestBody(fetchMock.mock.calls[0][1]?.body)
    expect(creemBody.success_url).toBe(
      `https://dockerman.app/en/pricing/success?transaction_id=${creemBody.request_id}&plan=1-device`
    )
    expect(creemBody.metadata).toEqual({ plan: '1-device', locale: 'en' })

    const posthogBody = parseJsonRequestBody(fetchMock.mock.calls[1][1]?.body)
    expect(posthogBody).toEqual({
      api_key: 'posthog-test-key',
      event: 'checkout_redirected',
      properties: {
        distinct_id: creemBody.request_id,
        plan: '1-device',
        locale: 'en',
        source: 'website',
        $host: 'dockerman.app',
        $geoip_disable: true
      }
    })
  })
})
