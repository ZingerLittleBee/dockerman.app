'use client'

import { useEffect } from 'react'

const THRESHOLDS = [25, 50, 75, 100] as const

export function useScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>()
    const pagePath = window.location.pathname

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const scrollPercent = (window.scrollY / scrollHeight) * 100

      for (const threshold of THRESHOLDS) {
        if (scrollPercent >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          import('posthog-js').then(({ default: posthog }) => {
            posthog.capture('page_scroll_depth', {
              depth: threshold,
              page_path: pagePath
            })
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
