import { downloadsConfig } from '@/config/downloads'
import { pricingConfig } from '@/config/pricing'

export function compareVars() {
  return {
    windows: downloadsConfig.latest.installers.windows[0].size,
    macos: downloadsConfig.latest.installers.macos[0].size,
    solo: pricingConfig.plans.solo.priceRegular,
    team: pricingConfig.plans.team.priceRegular
  }
}

export type CompareVars = ReturnType<typeof compareVars>
