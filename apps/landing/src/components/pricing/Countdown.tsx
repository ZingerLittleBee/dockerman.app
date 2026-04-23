'use client'

import { useEffect, useState } from 'react'

export function diff(targetMs: number, nowMs: number) {
  const ms = Math.max(0, targetMs - nowMs)
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    expired: ms === 0
  }
}

export function Countdown({ deadlineUtc }: { deadlineUtc: string }) {
  const target = new Date(deadlineUtc).getTime()
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(0)

  useEffect(() => {
    setMounted(true)
    setNow(Date.now())
    if (Date.now() >= target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!mounted) return null

  const d = diff(target, now)
  if (d.expired) return null

  const cells: Array<[string, number]> = [
    ['days', d.days],
    ['hours', d.hours],
    ['minutes', d.minutes],
    ['seconds', d.seconds]
  ]
  return (
    <div className="flex items-center gap-4 font-[var(--font-dm-mono)]">
      {cells.map(([label, v]) => (
        <div className="text-center" key={label}>
          <div className="font-bold text-[28px] text-dm-ink">
            {v.toString().padStart(2, '0')}
          </div>
          <div className="mt-1 text-[11px] text-dm-ink-3 uppercase tracking-wider">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
