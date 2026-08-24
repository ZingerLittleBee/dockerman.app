'use client'

import { useEffect } from 'react'

import { captureBrowserEvent } from '../analytics/browserPostHog'
import { createScrollDepthTracker } from '../analytics/pageTracking'

export function useScrollDepth(pagePath: string) {
  useEffect(() => {
    const tracker = createScrollDepthTracker(pagePath, (depth, trackedPagePath) => {
      captureBrowserEvent('page_scroll_depth', {
        depth,
        page_path: trackedPagePath
      })
    })

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      tracker.record(window.scrollY, scrollableHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pagePath])
}
