export const ENGAGE_THRESHOLD_MS = 10_000

const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const

type ScrollDepth = (typeof SCROLL_DEPTH_THRESHOLDS)[number]
type CaptureScrollDepth = (depth: ScrollDepth, pagePath: string) => void
type CapturePageEngagement = (durationSeconds: number, pagePath: string) => void

export function createScrollDepthTracker(pagePath: string, capture: CaptureScrollDepth) {
  const fired = new Set<ScrollDepth>()

  return {
    record(scrollY: number, scrollableHeight: number) {
      if (scrollableHeight <= 0) return

      const scrollPercent = (scrollY / scrollableHeight) * 100
      for (const threshold of SCROLL_DEPTH_THRESHOLDS) {
        if (scrollPercent >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          capture(threshold, pagePath)
        }
      }
    }
  }
}

export function createPageEngagementTracker(
  pagePath: string,
  startTime: number,
  capture: CapturePageEngagement
) {
  let hasInteracted = false
  let hasFired = false

  const check = (now: number) => {
    if (hasFired || !hasInteracted) return

    const elapsed = now - startTime
    if (elapsed < ENGAGE_THRESHOLD_MS) return

    hasFired = true
    capture(Math.round(elapsed / 1000), pagePath)
  }

  return {
    interact(now: number) {
      hasInteracted = true
      check(now)
    },
    check
  }
}
