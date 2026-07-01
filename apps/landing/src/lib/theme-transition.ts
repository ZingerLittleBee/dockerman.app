'use client'

import { startTransition } from 'react'

export function applyThemeWithTransition(apply: () => void) {
  if (typeof window === 'undefined') {
    apply()
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    apply()
    return
  }

  startTransition(apply)
}
