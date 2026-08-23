import { createHash, timingSafeEqual } from 'node:crypto'

import { isRecord } from '@/lib/typeGuards'

const CURRENCY_PATTERN = /^[a-z]{3}$/i
const SIGNATURE_PATTERN = /^[0-9a-f]{64}$/i
const REQUIRED_REDIRECT_KEYS = [
  'checkout_id',
  'order_id',
  'customer_id',
  'product_id',
  'request_id'
] as const

interface VerifiedRedirect {
  checkoutId: string
  customerId: string
  orderId: string
  productId: string
  requestId: string
}

export interface VerifiedPurchase {
  currency: string
  transactionId: string
  value: number
}

export type RedirectVerification =
  | { kind: 'invalid-payload' }
  | { kind: 'invalid-signature' }
  | { kind: 'verified'; redirect: VerifiedRedirect }

export type PurchaseVerification =
  | { kind: 'invalid-payload' }
  | { kind: 'invalid-signature' }
  | { kind: 'not-verified' }
  | { kind: 'unavailable' }
  | { kind: 'verified'; purchase: VerifiedPurchase }

interface VerifyPurchaseOptions {
  apiBaseUrl: string
  apiKey: string
  fetcher?: typeof fetch
  productIds: ReadonlySet<string>
  rawQuery: string
}

function decodeQueryComponent(value: string) {
  return decodeURIComponent(value.replace(/\+/g, ' '))
}

function hasMatchingSignature(signature: string, canonicalValue: string) {
  const normalizedSignature = signature.trim().toLowerCase()
  if (!SIGNATURE_PATTERN.test(normalizedSignature)) {
    return false
  }

  const expected = Buffer.from(createHash('sha256').update(canonicalValue).digest('hex'), 'hex')
  const received = Buffer.from(normalizedSignature, 'hex')
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export function parseVerifiedCreemRedirect(rawQuery: string, apiKey: string): RedirectVerification {
  const query = rawQuery.startsWith('?') ? rawQuery.slice(1) : rawQuery
  const canonicalParts: string[] = []
  const values = new Map<string, string>()
  let signature: string | null = null

  try {
    for (const pair of query.split('&')) {
      if (!pair) {
        continue
      }

      const separator = pair.indexOf('=')
      const encodedKey = separator === -1 ? pair : pair.slice(0, separator)
      const encodedValue = separator === -1 ? '' : pair.slice(separator + 1)
      const key = decodeQueryComponent(encodedKey)
      const value = decodeQueryComponent(encodedValue)

      if (key === 'signature') {
        if (signature !== null) {
          return { kind: 'invalid-payload' }
        }
        signature = value
        continue
      }

      if (value === '' || value === 'null') {
        continue
      }

      canonicalParts.push(`${key}=${value}`)
      if (values.has(key)) {
        return { kind: 'invalid-payload' }
      }
      values.set(key, value)
    }
  } catch {
    return { kind: 'invalid-payload' }
  }

  if (!signature) {
    return { kind: 'invalid-payload' }
  }

  canonicalParts.push(`salt=${apiKey}`)
  if (!hasMatchingSignature(signature, canonicalParts.join('|'))) {
    return { kind: 'invalid-signature' }
  }

  for (const key of REQUIRED_REDIRECT_KEYS) {
    const value = values.get(key)
    if (!value || value.length > 512) {
      return { kind: 'invalid-payload' }
    }
  }

  return {
    kind: 'verified',
    redirect: {
      checkoutId: values.get('checkout_id') as string,
      orderId: values.get('order_id') as string,
      customerId: values.get('customer_id') as string,
      productId: values.get('product_id') as string,
      requestId: values.get('request_id') as string
    }
  }
}

function entityId(value: unknown) {
  if (typeof value === 'string') {
    return value
  }
  return isRecord(value) && typeof value.id === 'string' ? value.id : null
}

function safeAmountMinor(value: unknown) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null
}

export async function verifyCreemPurchase({
  apiBaseUrl,
  apiKey,
  fetcher = fetch,
  productIds,
  rawQuery
}: VerifyPurchaseOptions): Promise<PurchaseVerification> {
  const redirectResult = parseVerifiedCreemRedirect(rawQuery, apiKey)
  if (redirectResult.kind !== 'verified') {
    return redirectResult
  }

  const { redirect } = redirectResult
  if (!productIds.has(redirect.productId)) {
    return { kind: 'not-verified' }
  }

  const checkoutUrl = new URL('/v1/checkouts', apiBaseUrl)
  checkoutUrl.searchParams.set('checkout_id', redirect.checkoutId)

  let response: Response
  try {
    response = await fetcher(checkoutUrl, {
      cache: 'no-store',
      headers: { 'x-api-key': apiKey }
    })
  } catch {
    return { kind: 'unavailable' }
  }

  if (!response.ok) {
    return { kind: 'unavailable' }
  }

  let checkout: unknown
  try {
    checkout = await response.json()
  } catch {
    return { kind: 'unavailable' }
  }

  if (!(isRecord(checkout) && isRecord(checkout.order))) {
    return { kind: 'not-verified' }
  }

  const order = checkout.order
  const amountMinor = safeAmountMinor(order.amount_paid) ?? safeAmountMinor(order.amount)
  const currency = order.currency
  const orderId = order.id

  if (
    checkout.status !== 'completed' ||
    checkout.id !== redirect.checkoutId ||
    checkout.request_id !== redirect.requestId ||
    entityId(checkout.product) !== redirect.productId ||
    entityId(checkout.customer) !== redirect.customerId ||
    order.status !== 'paid' ||
    orderId !== redirect.orderId ||
    order.product !== redirect.productId ||
    amountMinor === null ||
    typeof currency !== 'string' ||
    !CURRENCY_PATTERN.test(currency)
  ) {
    return { kind: 'not-verified' }
  }

  return {
    kind: 'verified',
    purchase: {
      transactionId: orderId,
      value: amountMinor / 100,
      currency: currency.toUpperCase()
    }
  }
}
