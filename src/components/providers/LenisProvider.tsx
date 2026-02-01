'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LenisRef } from 'lenis/react'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    // 将 Lenis 的 raf 添加到 GSAP ticker
    gsap.ticker.add(update)
    // 禁用 lag smoothing 以获得即时响应
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  useEffect(() => {
    // 当 Lenis 滚动时更新 ScrollTrigger
    const lenis = lenisRef.current?.lenis
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
    }

    return () => {
      lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true
      }}
      ref={lenisRef}
      root
    >
      {children}
    </ReactLenis>
  )
}
