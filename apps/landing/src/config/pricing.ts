export const pricingConfig = {
  earlyBirdDeadlineUtc: '2026-06-30T23:59:59Z',
  plans: {
    free: { price: 0 },
    team: { priceEarlyBird: 19, priceRegular: 29, devices: 3 },
    solo: { priceEarlyBird: 14, priceRegular: 19, devices: 1 }
  },
  refund: {
    days: 14
    // FAQ prose stays in packages/shared/src/locales/*.json under pricing.faq.items[]
  },
  trust: {
    asOf: '2026-04-23',
    users: 12_400,
    githubStars: 2100
  }
} as const

export type PricingConfig = typeof pricingConfig
