import { describe, expect, test } from 'bun:test'
import { parseGoogleAdsPurchase } from './googleAds'

const PURCHASE = {
  currency: 'usd',
  transactionId: 'ord_verified',
  value: 7.99
}

describe('Google Ads purchase conversion', () => {
  test('accepts a server-verified purchase response', () => {
    expect(parseGoogleAdsPurchase(PURCHASE)).toEqual({
      currency: 'USD',
      transactionId: 'ord_verified',
      value: 7.99
    })
  })

  test.each([
    null,
    { ...PURCHASE, currency: 'US dollars' },
    { ...PURCHASE, transactionId: '' },
    { ...PURCHASE, value: -1 },
    { ...PURCHASE, value: '7.99' }
  ])('rejects an invalid verification response', (value) => {
    expect(parseGoogleAdsPurchase(value)).toBeNull()
  })
})
