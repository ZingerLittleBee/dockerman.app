import type { getTranslation } from '@repo/shared/i18n/server'
import { ENGINES } from '@/components/home/data'
import { downloadsConfig } from '@/config/downloads'
import { pricingConfig } from '@/config/pricing'

export function compareVars() {
  return {
    windows: downloadsConfig.latest.installers.windows[0].size,
    macos: downloadsConfig.latest.installers.macos[0].size,
    solo: pricingConfig.plans.solo.priceRegular,
    team: pricingConfig.plans.team.priceRegular,
    engines: ENGINES.length
  }
}

export type CompareVars = ReturnType<typeof compareVars>

type CompareT = Awaited<ReturnType<typeof getTranslation>>['t']

export interface CompareFaqItem {
  question: string
  answer: string
}

/** FAQ entries with prices and sizes filled in; shared by the visible list and the FAQPage JSON-LD. */
export function compareFaq(t: CompareT, vars: CompareVars): CompareFaqItem[] {
  const raw: unknown = t('compare.faq.items', { returnObjects: true, ...vars })
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.filter(
    (item): item is CompareFaqItem =>
      typeof item?.question === 'string' && typeof item?.answer === 'string'
  )
}
