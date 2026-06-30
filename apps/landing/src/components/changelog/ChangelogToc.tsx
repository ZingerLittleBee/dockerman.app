'use client'

import Link from 'next/link'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangelogEntryData } from '@/lib/changelog'
import { ChangelogFilterContext } from './ChangelogFilterContext'

function scrollLinkIntoView(nav: HTMLElement | null, id: string) {
  if (!(nav && id)) return
  const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`)
  if (!link) return
  const linkTop = link.offsetTop
  const linkBottom = linkTop + link.offsetHeight
  const viewTop = nav.scrollTop
  const viewBottom = viewTop + nav.clientHeight
  const margin = 24
  if (linkTop < viewTop + margin) {
    nav.scrollTo({ top: Math.max(0, linkTop - margin), behavior: 'smooth' })
  } else if (linkBottom > viewBottom - margin) {
    nav.scrollTo({
      top: linkBottom - nav.clientHeight + margin,
      behavior: 'smooth'
    })
  }
}

export function ChangelogToc({ entries }: { entries: ChangelogEntryData[] }) {
  const filter = useContext(ChangelogFilterContext)
  const [observedActiveId, setObservedActiveId] = useState(entries[0]?.id ?? '')
  const navRef = useRef<HTMLElement | null>(null)
  const visibleIdSet = useMemo(
    () => (filter?.visibleIds ? new Set(filter.visibleIds) : null),
    [filter?.visibleIds]
  )
  const visibleEntries = useMemo(() => {
    if (!visibleIdSet) return entries
    return entries.filter((entry) => visibleIdSet.has(entry.id))
  }, [entries, visibleIdSet])
  const fallbackActiveId = visibleEntries[0]?.id ?? ''
  const active = visibleEntries.some((entry) => entry.id === observedActiveId)
    ? observedActiveId
    : fallbackActiveId

  useEffect(() => {
    const obs = new IntersectionObserver(
      (observations) => {
        const visible = observations.filter((o) => o.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const nextActiveId = visible[0].target.id
          setObservedActiveId(nextActiveId)
          scrollLinkIntoView(navRef.current, nextActiveId)
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    for (const e of visibleEntries) {
      const el = document.getElementById(e.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [visibleEntries])

  return (
    <nav
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:var(--color-dm-line-strong)_transparent] [scrollbar-width:thin]"
      ref={navRef}
    >
      <ul className="m-0 list-none border-dm-line border-l p-0">
        {visibleEntries.map((e) => {
          const isActive = active === e.id
          return (
            <li key={e.id}>
              <Link
                className="-ml-px flex min-w-0 items-center gap-[10px] border-l px-[14px] py-2 font-[var(--font-dm-mono)] text-[13px] no-underline transition-colors"
                href={`#${e.id}`}
                style={{
                  color: isActive ? 'var(--color-dm-ink)' : 'var(--color-dm-ink-3)',
                  borderLeftColor: isActive ? 'var(--color-dm-accent-2)' : 'transparent',
                  backgroundImage: isActive
                    ? 'linear-gradient(90deg, color-mix(in srgb, var(--color-dm-accent-2) 8%, transparent), transparent)'
                    : undefined
                }}
                title={`v${e.version} · ${formatShortDate(e.date)}`}
              >
                <span className="min-w-0 flex-1 truncate font-semibold">v{e.version}</span>
                <span
                  className="shrink-0 text-[11px]"
                  style={{
                    color: isActive ? 'var(--color-dm-ink-3)' : 'var(--color-dm-ink-4)'
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
      'Dec'
    ]
    return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`
  } catch {
    return iso
  }
}
