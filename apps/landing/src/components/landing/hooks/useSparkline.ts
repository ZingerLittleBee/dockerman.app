'use client'

import { useEffect, useRef, useState } from 'react'

interface Options {
  seed: number[]
  intervalMs: number
  volatility?: number
  min?: number
  max?: number
  enabled?: boolean
}

export function useSparkline({
  seed,
  intervalMs,
  volatility = 0.15,
  min = 0,
  max = 100,
  enabled = true,
}: Options) {
  // seed is initial-only: changing seed across renders won't reset state.
  const [data, setData] = useState<number[]>(seed)
  const dataRef = useRef(seed)

  useEffect(() => {
    if (!enabled) {
      return
    }
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      return
    }

    const id = setInterval(() => {
      const prev = dataRef.current
      const last = prev[prev.length - 1] ?? 50
      const delta = (Math.random() - 0.5) * (max - min) * volatility
      const next = Math.max(min, Math.min(max, last + delta))
      const newData = [...prev.slice(1), next]
      dataRef.current = newData
      setData(newData)
    }, intervalMs)

    return () => clearInterval(id)
  }, [intervalMs, volatility, min, max, enabled])

  return data
}
