import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import { NextRequest } from 'next/server'

const originalFetch = globalThis.fetch
const originalEnv = {
  CREEM_API_KEY: process.env.CREEM_API_KEY,
  CREEM_PRODUCT_ID_1_DEVICES: process.env.CREEM_PRODUCT_ID_1_DEVICES,
  CREEM_PRODUCT_ID_3_DEVICES: process.env.CREEM_PRODUCT_ID_3_DEVICES
}

process.env.CREEM_API_KEY = 'creem-test-key'
process.env.CREEM_PRODUCT_ID_1_DEVICES = 'prod_one_device'
process.env.CREEM_PRODUCT_ID_3_DEVICES = 'prod_three_devices'

const { GET, POST } = await import('./route')

function checkoutRequest(method: 'GET' | 'POST', plan = '1-device') {
  return new NextRequest(`https://dockerman.app/api/checkout?plan=${plan}&locale=en`, { method })
}

beforeEach(() => {
  process.env.CREEM_API_KEY = 'creem-test-key'
  process.env.CREEM_PRODUCT_ID_1_DEVICES = 'prod_one_device'
  process.env.CREEM_PRODUCT_ID_3_DEVICES = 'prod_three_devices'
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
  test('does not create checkout sessions from GET requests', async () => {
    const fetchMock = mock(async () => Response.json({ checkout_url: 'https://checkout.test/pay' }))
    globalThis.fetch = fetchMock

    const response = await GET(checkoutRequest('GET'))

    expect(response.status).toBe(405)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('creates checkout sessions from POST requests', async () => {
    const fetchMock = mock(async () => Response.json({ checkout_url: 'https://checkout.test/pay' }))
    globalThis.fetch = fetchMock

    const response = await POST(checkoutRequest('POST'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://checkout.test/pay')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('https://test-api.creem.io/v1/checkouts')
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST')
  })
})
