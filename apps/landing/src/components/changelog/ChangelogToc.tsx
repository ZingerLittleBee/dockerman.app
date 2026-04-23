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
    <nav className="sticky top-24 space-y-1 text-[13px]">
      {entries.map((e) => (
        <Link
          className={`block rounded-md px-2 py-[6px] ${
            active === e.id ? 'bg-dm-bg-soft text-dm-ink' : 'text-dm-ink-3 hover:bg-dm-bg-soft'
          }`}
          href={`#${e.id}`}
          key={e.id}
        >
          <span className="font-[var(--font-dm-mono)]">v{e.version}</span>
          <span className="ml-2 text-dm-ink-4">{e.date}</span>
        </Link>
      ))}
    </nav>
  )
}
