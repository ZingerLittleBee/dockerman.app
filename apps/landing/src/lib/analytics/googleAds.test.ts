import { describe, expect, test } from 'bun:test'
import { parseGoogleAdsPurchase } from './googleAds'

const TRANSACTION_ID = '018f3b4c-5d6e-7f80-9123-a456789bcdef'

describe('Google Ads purchase conversion', () => {
  test.each([
    ['1-device', 19],
    ['3-devices', 29]
  ])('maps the %s plan to its USD purchase value', (plan, value) => {
    const searchParams = new URLSearchParams({
      transaction_id: TRANSACTION_ID,
      plan
    })

    expect(parseGoogleAdsPurchase(searchParams)).toEqual({
      currency: 'USD',
      transactionId: TRANSACTION_ID,
      value
    })
  })

  test.each([
    new URLSearchParams({ plan: '1-device' }),
    new URLSearchParams({ transaction_id: TRANSACTION_ID }),
    new URLSearchParams({ transaction_id: 'not-a-uuid', plan: '1-device' }),
    new URLSearchParams({ transaction_id: TRANSACTION_ID, plan: 'free' })
  ])('rejects untrusted success-page parameters', (searchParams) => {
    expect(parseGoogleAdsPurchase(searchParams)).toBeNull()
  })
})
