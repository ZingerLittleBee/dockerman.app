'use client'

import { usePathname } from 'next/navigation'

import { usePageEngaged } from '../hooks/usePageEngaged'
import { useScrollDepth } from '../hooks/useScrollDepth'

export function AnalyticsTracker() {
  const pagePath = usePathname()

  useScrollDepth(pagePath)
  usePageEngaged(pagePath)
  return null
}
