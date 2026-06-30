'use client'

import type { Locale } from '@repo/shared/i18n'
import { useTranslation } from '@repo/shared/i18n/client'
import { useSyncExternalStore } from 'react'
import { diff } from './countdownDiff'

let currentNow = Date.now()
let clockTimer: ReturnType<typeof setInterval> | undefined
const clockListeners = new Set<() => void>()

function startClock() {
  if (clockTimer !== undefined) {
    return
  }
  clockTimer = setInterval(() => {
    currentNow = Date.now()
    for (const listener of clockListeners) {
      listener()
    }
  }, 1000)
}

function stopClock() {
  if (clockListeners.size > 0 || clockTimer === undefined) {
    return
  }
  clearInterval(clockTimer)
  clockTimer = undefined
}

function subscribeClock(listener: () => void) {
  clockListeners.add(listener)
  currentNow = Date.now()
  startClock()
  listener()
  return () => {
    clockListeners.delete(listener)
    stopClock()
  }
}

function getClockSnapshot() {
  return currentNow
}

function getServerClockSnapshot() {
  return null
}

export function Countdown({ deadlineUtc, locale }: { deadlineUtc: string; locale: Locale }) {
  const { t } = useTranslation(locale)
  const target = new Date(deadlineUtc).getTime()
  const now = useSyncExternalStore(subscribeClock, getClockSnapshot, getServerClockSnapshot)

  if (now === null) return null

  const d = diff(target, now)
  if (d.expired) return null

  const cells: [string, number][] = [
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
