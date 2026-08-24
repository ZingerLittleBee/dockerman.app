'use client'

import { useEffect } from 'react'

import { captureBrowserEvent } from '../analytics/browserPostHog'
import { createPageEngagementTracker, ENGAGE_THRESHOLD_MS } from '../analytics/pageTracking'

export function usePageEngaged(pagePath: string) {
  useEffect(() => {
    const tracker = createPageEngagementTracker(
      pagePath,
      Date.now(),
      (duration, trackedPagePath) => {
        captureBrowserEvent('page_engaged', {
          page_path: trackedPagePath,
          duration_seconds: duration
        })
      }
    )

    const handleInteraction = () => {
      tracker.interact(Date.now())
    }

    window.addEventListener('click', handleInteraction, { passive: true, once: true })
    window.addEventListener('scroll', handleInteraction, { passive: true, once: true })
    window.addEventListener('keydown', handleInteraction, { passive: true, once: true })

    const timer = setTimeout(() => tracker.check(Date.now()), ENGAGE_THRESHOLD_MS)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [pagePath])
}
