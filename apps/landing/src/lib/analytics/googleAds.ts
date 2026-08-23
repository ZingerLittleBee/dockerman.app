import { isRecord } from '@/lib/typeGuards'

export const GOOGLE_ADS_ID = 'AW-18367949196'
export const GOOGLE_ADS_PURCHASE_DESTINATION = `${GOOGLE_ADS_ID}/K-4DCNvMh9scEIzTwrZE`

const CURRENCY_PATTERN = /^[a-z]{3}$/i

export interface GoogleAdsPurchase {
  currency: string
  transactionId: string
  value: number
}

export function parseGoogleAdsPurchase(value: unknown): GoogleAdsPurchase | null {
  if (!isRecord(value)) {
    return null
  }

  const { currency, transactionId, value: purchaseValue } = value
  if (
    typeof currency !== 'string' ||
    !CURRENCY_PATTERN.test(currency) ||
    typeof transactionId !== 'string' ||
    transactionId.length === 0 ||
    typeof purchaseValue !== 'number' ||
    !Number.isFinite(purchaseValue) ||
    purchaseValue < 0
  ) {
    return null
  }

  return {
    currency: currency.toUpperCase(),
    transactionId,
    value: purchaseValue
  }
}
