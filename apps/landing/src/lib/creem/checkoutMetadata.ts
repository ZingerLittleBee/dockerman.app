import { defaultLocale, type Locale } from '@repo/shared/i18n'
import { pricingConfig } from '@/config/pricing'

export type PaidPlan = '1-device' | '3-devices'

export function parsePaidPlan(value: unknown): PaidPlan | null {
  if (value === '1-device' || value === '3-devices') {
    return value
  }

  return null
}

export function normalizeLocale(value: unknown): Locale {
  if (value === 'en' || value === 'zh' || value === 'ja' || value === 'es') {
    return value
  }

  return defaultLocale
}

export function getPaidPlanConfig(plan: PaidPlan) {
  if (plan === '1-device') {
    return {
      productId: process.env.CREEM_PRODUCT_ID_1_DEVICES,
      discountCode: pricingConfig.discountCodes['1-device']
    }
  }

  return {
    productId: process.env.CREEM_PRODUCT_ID_3_DEVICES,
    discountCode: pricingConfig.discountCodes['3-devices']
  }
}
