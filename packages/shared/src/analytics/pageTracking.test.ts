import { describe, expect, test } from 'bun:test'

import { createPageEngagementTracker, createScrollDepthTracker } from './pageTracking'

describe('page analytics tracking', () => {
  test('starts scroll thresholds over for each pathname', () => {
    const events: Array<{ depth: number; pagePath: string }> = []
    const capture = (depth: number, pagePath: string) => {
      events.push({ depth, pagePath })
    }

    const home = createScrollDepthTracker('/en', capture)
    home.record(30, 100)
    home.record(35, 100)

    const pricing = createScrollDepthTracker('/en/pricing', capture)
    pricing.record(30, 100)

    expect(events).toEqual([
      { depth: 25, pagePath: '/en' },
      { depth: 25, pagePath: '/en/pricing' }
    ])
  })

  test('attributes engagement to the current pathname exactly once', () => {
    const events: Array<{ durationSeconds: number; pagePath: string }> = []
    const capture = (durationSeconds: number, pagePath: string) => {
      events.push({ durationSeconds, pagePath })
    }

    const home = createPageEngagementTracker('/en', 0, capture)
    home.interact(5000)
    home.check(10_000)
    home.check(12_000)

    const pricing = createPageEngagementTracker('/en/pricing', 20_000, capture)
    pricing.interact(31_000)
    pricing.check(35_000)

    expect(events).toEqual([
      { durationSeconds: 10, pagePath: '/en' },
      { durationSeconds: 11, pagePath: '/en/pricing' }
    ])
  })
})
