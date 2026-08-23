import { pricingConfig } from '@/config/pricing'
import { type PaidPlan, parsePaidPlan } from '@/lib/creem/checkoutMetadata'

export const GOOGLE_ADS_ID = 'AW-18367949196'
export const GOOGLE_ADS_PURCHASE_DESTINATION = `${GOOGLE_ADS_ID}/K-4DCNvMh9scEIzTwrZE`

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const PLAN_VALUES: Record<PaidPlan, number> = {
  '1-device': pricingConfig.plans.solo.priceRegular,
  '3-devices': pricingConfig.plans.team.priceRegular
}

export interface GoogleAdsPurchase {
  currency: 'USD'
  transactionId: string
  value: number
}

export function parseGoogleAdsPurchase(searchParams: URLSearchParams): GoogleAdsPurchase | null {
  const transactionId = searchParams.get('transaction_id')
  const plan = parsePaidPlan(searchParams.get('plan'))

  if (!(transactionId && UUID_PATTERN.test(transactionId) && plan)) {
    return null
  }

  return {
    currency: 'USD',
    transactionId,
    value: PLAN_VALUES[plan]
  }
}
