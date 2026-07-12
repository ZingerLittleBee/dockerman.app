import { describe, expect, test } from 'bun:test'
import { createHmac } from 'node:crypto'

import { parseVerifiedCreemWebhook } from './webhook'

const WEBHOOK_SECRET = 'creem-test-secret'
const COMPLETED_CHECKOUT =
  '{"id":"evt_test_123","eventType":"checkout.completed","created_at":1783877000000,"object":{"id":"ch_private","request_id":"018f3b4c-5d6e-7f80-9123-a456789bcdef","status":"completed","metadata":{"plan":"3-devices","locale":"zh"},"order":{"id":"ord_private","amount":799,"currency":"USD","status":"paid"},"customer":{"id":"cus_private","name":"Private Person","email":"private@example.com","country":"US"}}}'
const COMPLETED_CHECKOUT_SIGNATURE =
  '66c939be127361b0181dc23c1f9b3e989f88c69bb9d4f9fe266d6cf744e7b50d'

function sign(body: string) {
  return createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
}

describe('Creem webhook verification', () => {
  test('returns only privacy-safe purchase fields for a literal signed fixture', () => {
    expect(
      parseVerifiedCreemWebhook(COMPLETED_CHECKOUT, COMPLETED_CHECKOUT_SIGNATURE, WEBHOOK_SECRET)
    ).toEqual({
      kind: 'purchase',
      purchase: {
        requestId: '018f3b4c-5d6e-7f80-9123-a456789bcdef',
        plan: '3-devices',
        locale: 'zh',
        amountMinor: 799,
        currency: 'USD'
      }
    })
  })

  test('rejects an invalid signature before parsing the payload', () => {
    expect(
      parseVerifiedCreemWebhook(COMPLETED_CHECKOUT, 'not-a-valid-signature', WEBHOOK_SECRET)
    ).toEqual({ kind: 'invalid-signature' })
  })

  test('ignores valid events that do not represent a paid completed checkout', () => {
    const unpaidCheckout = COMPLETED_CHECKOUT.replace('"status":"paid"', '"status":"pending"')
    const unrelatedEvent = COMPLETED_CHECKOUT.replace(
      '"eventType":"checkout.completed"',
      '"eventType":"subscription.active"'
    )

    expect(parseVerifiedCreemWebhook(unpaidCheckout, sign(unpaidCheckout), WEBHOOK_SECRET)).toEqual(
      {
        kind: 'ignored'
      }
    )
    expect(parseVerifiedCreemWebhook(unrelatedEvent, sign(unrelatedEvent), WEBHOOK_SECRET)).toEqual(
      {
        kind: 'ignored'
      }
    )
  })

  test('rejects malformed signed JSON', () => {
    const malformedBody = '{"eventType":'

    expect(parseVerifiedCreemWebhook(malformedBody, sign(malformedBody), WEBHOOK_SECRET)).toEqual({
      kind: 'invalid-payload'
    })
  })

  test('does not forward an untrusted locale value', () => {
    const checkoutWithUntrustedLocale = COMPLETED_CHECKOUT.replace(
      '"locale":"zh"',
      '"locale":"private@example.com"'
    )

    expect(
      parseVerifiedCreemWebhook(
        checkoutWithUntrustedLocale,
        sign(checkoutWithUntrustedLocale),
        WEBHOOK_SECRET
      )
    ).toEqual({
      kind: 'purchase',
      purchase: {
        requestId: '018f3b4c-5d6e-7f80-9123-a456789bcdef',
        plan: '3-devices',
        locale: 'en',
        amountMinor: 799,
        currency: 'USD'
      }
    })
  })
})
