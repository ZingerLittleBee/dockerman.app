'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ChangelogEntryData } from '@/lib/changelog'

export function ChangelogToc({ entries }: { entries: ChangelogEntryData[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? '')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (observations) => {
        const visible = observations.filter((o) => o.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    for (const e of entries) {
      const el = document.getElementById(e.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [entries])

  return (
    <nav className="sticky top-24">
      <ul className="m-0 list-none border-dm-line border-l p-0">
        {entries.map((e) => {
          const isActive = active === e.id
          return (
            <li key={e.id}>
              <Link
                className="-ml-px flex items-center gap-[10px] border-l px-[14px] py-2 font-[var(--font-dm-mono)] text-[13px] no-underline transition-colors"
                href={`#${e.id}`}
                style={{
                  color: isActive ? 'var(--color-dm-ink)' : 'var(--color-dm-ink-3)',
                  borderLeftColor: isActive ? 'var(--color-dm-accent-2)' : 'transparent',
                  backgroundImage: isActive
                    ? 'linear-gradient(90deg, color-mix(in srgb, var(--color-dm-accent-2) 8%, transparent), transparent)'
                    : undefined,
                }}
              >
                <span className="font-semibold">v{e.version}</span>
                <span
                  className="ml-auto text-[11px]"
                  style={{
                    color: isActive ? 'var(--color-dm-ink-3)' : 'var(--color-dm-ink-4)',
                  }}
                >
                  {formatShortDate(e.date)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`
  } catch {
    return iso
  }
}
