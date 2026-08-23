import { type NextRequest, NextResponse } from 'next/server'

import { verifyCreemPurchase } from '@/lib/creem/purchaseRedirect'

const CREEM_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.creem.io' : 'https://test-api.creem.io'

function noStoreJson(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' }
  })
}

function rawQueryFromUrl(url: string) {
  const queryStart = url.indexOf('?')
  return queryStart === -1 ? '' : url.slice(queryStart + 1)
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.CREEM_API_KEY
  const productIds = new Set(
    [process.env.CREEM_PRODUCT_ID_1_DEVICES, process.env.CREEM_PRODUCT_ID_3_DEVICES].filter(
      (value): value is string => Boolean(value)
    )
  )

  if (!apiKey || productIds.size === 0) {
    return noStoreJson({ error: 'Payment verification not configured' }, 503)
  }

  const result = await verifyCreemPurchase({
    apiBaseUrl: CREEM_BASE_URL,
    apiKey,
    productIds,
    rawQuery: rawQueryFromUrl(request.url)
  })

  if (result.kind === 'invalid-signature') {
    return noStoreJson({ error: 'Invalid payment signature' }, 401)
  }

  if (result.kind === 'invalid-payload') {
    return noStoreJson({ error: 'Invalid payment parameters' }, 400)
  }

  if (result.kind === 'unavailable') {
    return noStoreJson({ error: 'Payment verification unavailable' }, 502)
  }

  if (result.kind === 'not-verified') {
    return noStoreJson({ error: 'Payment not verified' }, 409)
  }

  return noStoreJson(result.purchase)
}
