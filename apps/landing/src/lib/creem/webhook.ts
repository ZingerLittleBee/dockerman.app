import { createHmac, timingSafeEqual } from 'node:crypto'

import type { Locale } from '@repo/shared/i18n'
import { normalizeLocale, type PaidPlan, parsePaidPlan } from '@/lib/creem/checkoutMetadata'
import { isRecord } from '@/lib/typeGuards'

const CURRENCY_PATTERN = /^[a-z]{3}$/i
const SIGNATURE_PATTERN = /^[0-9a-f]{64}$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

interface PrivacySafePurchase {
  amountMinor: number
  currency: string
  locale: Locale
  plan: PaidPlan
  requestId: string
}

export type VerifiedCreemWebhook =
  | { kind: 'ignored' }
  | { kind: 'invalid-payload' }
  | { kind: 'invalid-signature' }
  | { kind: 'purchase'; purchase: PrivacySafePurchase }

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value)
}

function hasValidSignature(rawBody: string, signature: string, secret: string) {
  const normalizedSignature = signature.trim().toLowerCase()
  if (!SIGNATURE_PATTERN.test(normalizedSignature)) {
    return false
  }

  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'), 'hex')
  const received = Buffer.from(normalizedSignature, 'hex')

  return expected.length === received.length && timingSafeEqual(expected, received)
}

export function parseVerifiedCreemWebhook(
  rawBody: string,
  signature: string,
  secret: string
): VerifiedCreemWebhook {
  if (!hasValidSignature(rawBody, signature, secret)) {
    return { kind: 'invalid-signature' }
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return { kind: 'invalid-payload' }
  }

  if (!isRecord(payload) || typeof payload.eventType !== 'string') {
    return { kind: 'invalid-payload' }
  }

  if (payload.eventType !== 'checkout.completed') {
    return { kind: 'ignored' }
  }

  const checkout = payload.object
  if (!isRecord(checkout)) {
    return { kind: 'invalid-payload' }
  }

  const order = checkout.order
  if (!isRecord(order)) {
    return { kind: 'invalid-payload' }
  }

  if (checkout.status !== 'completed' || order.status !== 'paid') {
    return { kind: 'ignored' }
  }

  const metadata = checkout.metadata
  if (!isRecord(metadata)) {
    return { kind: 'invalid-payload' }
  }

  const plan = parsePaidPlan(metadata.plan)
  const amountMinor = order.amount
  const currency = order.currency

  if (!(isUuid(checkout.request_id) && plan)) {
    return { kind: 'invalid-payload' }
  }

  if (
    typeof amountMinor !== 'number' ||
    !Number.isSafeInteger(amountMinor) ||
    amountMinor < 0 ||
    typeof currency !== 'string' ||
    !CURRENCY_PATTERN.test(currency)
  ) {
    return { kind: 'invalid-payload' }
  }

  return {
    kind: 'purchase',
    purchase: {
      requestId: checkout.request_id,
      plan,
      locale: normalizeLocale(metadata.locale),
      amountMinor,
      currency: currency.toUpperCase()
    }
  }
}
