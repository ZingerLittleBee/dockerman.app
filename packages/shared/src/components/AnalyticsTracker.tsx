'use client'

import { usePageEngaged } from '../hooks/usePageEngaged'
import { useScrollDepth } from '../hooks/useScrollDepth'

export function AnalyticsTracker() {
  useScrollDepth()
  usePageEngaged()
  return null
}
