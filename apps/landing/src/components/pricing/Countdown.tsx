'use client'

import type { Locale } from '@repo/shared/i18n'
import { useTranslation } from '@repo/shared/i18n/client'
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

export function Countdown({ deadlineUtc, locale }: { deadlineUtc: string; locale: Locale }) {
  const { t } = useTranslation(locale)
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
    [t('pricing.countdown.days'), d.days],
    [t('pricing.countdown.hrs'), d.hours],
    [t('pricing.countdown.min'), d.minutes],
    [t('pricing.countdown.sec'), d.seconds]
  ]
  return (
    <div className="flex gap-[6px] font-[var(--font-dm-mono)] tabular-nums">
      {cells.map(([label, v]) => (
        <div
          className="min-w-[42px] rounded-[7px] px-[2px] py-[6px] text-center"
          key={label}
          style={{ background: 'var(--color-dm-ink)', color: 'var(--color-dm-bg)' }}
        >
          <div className="font-bold text-[18px] leading-none tracking-[-0.02em]">
            {v.toString().padStart(2, '0')}
          </div>
          <div
            className="mt-[3px] text-[9px] uppercase tracking-[0.08em]"
            style={{ color: 'color-mix(in srgb, var(--color-dm-bg) 50%, var(--color-dm-ink))' }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
