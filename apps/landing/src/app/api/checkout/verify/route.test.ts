import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { NextRequest } from 'next/server'

const originalFetch = globalThis.fetch
const originalEnv = {
  CREEM_API_KEY: process.env.CREEM_API_KEY,
  CREEM_PRODUCT_ID_1_DEVICES: process.env.CREEM_PRODUCT_ID_1_DEVICES,
  CREEM_PRODUCT_ID_3_DEVICES: process.env.CREEM_PRODUCT_ID_3_DEVICES
}

const API_KEY = 'creem-test-key'
const REDIRECT_VALUES = {
  checkout_id: 'ch_verified',
  order_id: 'ord_verified',
  customer_id: 'cus_verified',
  product_id: 'prod_one_device',
  request_id: '018f3b4c-5d6e-7f80-9123-a456789bcdef'
}

process.env.CREEM_API_KEY = API_KEY
process.env.CREEM_PRODUCT_ID_1_DEVICES = 'prod_one_device'
process.env.CREEM_PRODUCT_ID_3_DEVICES = 'prod_three_devices'

const { GET } = await import('./route')

function signedQuery(overrides: Partial<typeof REDIRECT_VALUES> = {}) {
  const values = { ...REDIRECT_VALUES, ...overrides }
  const parts = Object.entries(values).map(([key, value]) => `${key}=${value}`)
  const signature = createHash('sha256')
    .update([...parts, `salt=${API_KEY}`].join('|'))
    .digest('hex')
  return `${parts.join('&')}&signature=${signature}`
}

function verificationRequest(query = signedQuery()) {
  return new NextRequest(`https://dockerman.app/api/checkout/verify?${query}`)
}

function completedCheckout() {
  return {
    id: REDIRECT_VALUES.checkout_id,
    status: 'completed',
    request_id: REDIRECT_VALUES.request_id,
    product: REDIRECT_VALUES.product_id,
    customer: { id: REDIRECT_VALUES.customer_id },
    order: {
      id: REDIRECT_VALUES.order_id,
      status: 'paid',
      product: REDIRECT_VALUES.product_id,
      amount: 1900,
      amount_paid: 799,
      currency: 'usd'
    }
  }
}

beforeEach(() => {
  process.env.CREEM_API_KEY = API_KEY
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

describe('checkout verification route', () => {
  test('returns the real paid amount from a matching completed checkout', async () => {
    const fetchMock = mock(async () => Response.json(completedCheckout()))
    globalThis.fetch = fetchMock

    const response = await GET(verificationRequest())

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(await response.json()).toEqual({
      transactionId: REDIRECT_VALUES.order_id,
      value: 7.99,
      currency: 'USD'
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0].toString()).toBe(
      `https://test-api.creem.io/v1/checkouts?checkout_id=${REDIRECT_VALUES.checkout_id}`
    )
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('x-api-key')).toBe(API_KEY)
  })

  test('rejects a forged redirect before contacting Creem', async () => {
    const fetchMock = mock(async () => Response.json(completedCheckout()))
    globalThis.fetch = fetchMock
    const query = signedQuery().replace('product_id=prod_one_device', 'product_id=prod_other')

    const response = await GET(verificationRequest(query))

    expect(response.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test.each([
    ['pending checkout', { status: 'pending' }],
    ['unpaid order', { order: { ...completedCheckout().order, status: 'pending' } }],
    ['mismatched order', { order: { ...completedCheckout().order, id: 'ord_other' } }],
    ['mismatched customer', { customer: { id: 'cus_other' } }],
    ['mismatched product', { product: 'prod_three_devices' }],
    ['mismatched request', { request_id: 'request_other' }]
  ])('does not verify a %s', async (_name, checkoutOverride) => {
    const fetchMock = mock(async () =>
      Response.json({ ...completedCheckout(), ...checkoutOverride })
    )
    globalThis.fetch = fetchMock

    const response = await GET(verificationRequest())

    expect(response.status).toBe(409)
  })

  test('does not verify a product that is not configured for sale', async () => {
    const fetchMock = mock(async () => Response.json(completedCheckout()))
    globalThis.fetch = fetchMock

    const response = await GET(
      verificationRequest(signedQuery({ product_id: 'prod_unconfigured' }))
    )

    expect(response.status).toBe(409)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('reports an unavailable Creem lookup without leaking its response', async () => {
    const fetchMock = mock(async () =>
      Response.json({ private: 'upstream response' }, { status: 503 })
    )
    globalThis.fetch = fetchMock

    const response = await GET(verificationRequest())

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Payment verification unavailable' })
  })
})
