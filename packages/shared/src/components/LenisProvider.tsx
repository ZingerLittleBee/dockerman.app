'use client'

import { ReactLenis } from 'lenis/react'
import { useSyncExternalStore } from 'react'

function subscribeReducedMotion(listener: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', listener)
  return () => mq.removeEventListener('change', listener)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerReducedMotionSnapshot() {
  return false
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )

  if (reduced) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true
      }}
      root
    >
      {children}
    </ReactLenis>
  )
}
