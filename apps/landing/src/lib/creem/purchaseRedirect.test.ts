import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'

import { parseVerifiedCreemRedirect } from './purchaseRedirect'

const API_KEY = 'creem-test-key'

function sign(canonicalParts: string[]) {
  return createHash('sha256')
    .update([...canonicalParts, `salt=${API_KEY}`].join('|'))
    .digest('hex')
}

describe('Creem purchase redirect', () => {
  test('verifies decoded parameters in their original order', () => {
    const canonicalParts = [
      'checkout_id=ch verified',
      'order_id=ord_verified',
      'customer_id=cus_verified',
      'product_id=prod_one_device',
      'request_id=request/verified'
    ]
    const rawQuery = [
      'checkout_id=ch+verified',
      'order_id=ord_verified',
      'empty=',
      'customer_id=cus_verified',
      'product_id=prod_one_device',
      'nullable=null',
      'request_id=request%2Fverified',
      `signature=${sign(canonicalParts)}`
    ].join('&')

    expect(parseVerifiedCreemRedirect(rawQuery, API_KEY)).toEqual({
      kind: 'verified',
      redirect: {
        checkoutId: 'ch verified',
        orderId: 'ord_verified',
        customerId: 'cus_verified',
        productId: 'prod_one_device',
        requestId: 'request/verified'
      }
    })
  })

  test('rejects tampered and ambiguous redirects', () => {
    const parts = [
      'checkout_id=ch_verified',
      'order_id=ord_verified',
      'customer_id=cus_verified',
      'product_id=prod_one_device',
      'request_id=req_verified'
    ]
    const signature = sign(parts)

    expect(
      parseVerifiedCreemRedirect(
        `${parts.join('&')}&product_id=prod_other&signature=${signature}`,
        API_KEY
      )
    ).toEqual({ kind: 'invalid-payload' })
    expect(
      parseVerifiedCreemRedirect(`${parts.join('&')}&signature=${signature.slice(0, -1)}0`, API_KEY)
    ).toEqual({ kind: 'invalid-signature' })
  })
})
