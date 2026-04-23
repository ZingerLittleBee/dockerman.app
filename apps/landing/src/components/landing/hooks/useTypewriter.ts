'use client'

import { useEffect, useState } from 'react'

export function useTypewriter({
  lines,
  charMs = 60,
  holdMs = 1200,
  enabled = true,
}: {
  lines: string[]
  charMs?: number
  holdMs?: number
  enabled?: boolean
}) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (!enabled || lines.length === 0) {
      return
    }
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setCharIdx(lines[0].length)
      return
    }

    const current = lines[lineIdx]
    if (charIdx < current.length) {
      const t = setTimeout(() => setCharIdx((i) => i + 1), charMs)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setCharIdx(0)
      setLineIdx((i) => (i + 1) % lines.length)
    }, holdMs)
    return () => clearTimeout(t)
  }, [charIdx, lineIdx, lines, charMs, holdMs, enabled])

  return { text: lines[lineIdx]?.slice(0, charIdx) ?? '', lineIdx }
}
