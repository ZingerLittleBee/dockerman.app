'use client'

import { flushSync } from 'react-dom'

export function applyThemeWithTransition(apply: () => void) {
  if (typeof document === 'undefined') {
    apply()
    return
  }

  const supportsViewTransition = typeof document.startViewTransition === 'function'
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!supportsViewTransition || prefersReducedMotion) {
    apply()
    return
  }

  const transition = document.startViewTransition(() => {
    flushSync(apply)
  })

  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: ['inset(0 0 100% 0)', 'inset(0)'] },
        {
          pseudoElement: '::view-transition-new(root)',
          duration: 600,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
      )
    })
    .catch(() => {
      /* swallow transition aborts */
    })
}
