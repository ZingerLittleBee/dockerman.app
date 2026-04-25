'use client'

import { ReactLenis } from 'lenis/react'

export function LenisProvider({ children }: { children: React.ReactNode }) {
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
