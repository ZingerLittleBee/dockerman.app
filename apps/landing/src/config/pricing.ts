export const pricingConfig = {
  earlyBirdDeadlineUtc: '2026-04-30T23:59:59Z',
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
    monthlyDownloads: 15_000,
    downloadsEstimatedFrom: 'R2 GET requests, last 30 days',
    githubStars: 300
  }
} as const

export type PricingConfig = typeof pricingConfig
