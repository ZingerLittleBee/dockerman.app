'use client'

import { useEffect } from 'react'

const ENGAGE_THRESHOLD_MS = 10_000

export function usePageEngaged() {
  useEffect(() => {
    let hasInteracted = false
    let hasFired = false
    const pagePath = window.location.pathname
    const startTime = Date.now()

    const markInteracted = () => {
      hasInteracted = true
    }

    const tryFire = () => {
      if (hasFired || !hasInteracted) return
      const elapsed = Date.now() - startTime
      if (elapsed < ENGAGE_THRESHOLD_MS) return

      hasFired = true
      import('posthog-js').then(({ default: posthog }) => {
        posthog.capture('page_engaged', {
          page_path: pagePath,
          duration_seconds: Math.round(elapsed / 1000)
        })
      })
    }

    window.addEventListener('click', markInteracted, { passive: true, once: true })
    window.addEventListener('scroll', markInteracted, { passive: true, once: true })
    window.addEventListener('keydown', markInteracted, { passive: true, once: true })

    const timer = setTimeout(() => {
      tryFire()
      if (!hasInteracted) {
        const onLateInteract = () => {
          tryFire()
          window.removeEventListener('click', onLateInteract)
          window.removeEventListener('scroll', onLateInteract)
          window.removeEventListener('keydown', onLateInteract)
        }
        window.addEventListener('click', onLateInteract, { passive: true, once: true })
        window.addEventListener('scroll', onLateInteract, { passive: true, once: true })
        window.addEventListener('keydown', onLateInteract, { passive: true, once: true })
      }
    }, ENGAGE_THRESHOLD_MS)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', markInteracted)
      window.removeEventListener('scroll', markInteracted)
      window.removeEventListener('keydown', markInteracted)
    }
  }, [])
}
