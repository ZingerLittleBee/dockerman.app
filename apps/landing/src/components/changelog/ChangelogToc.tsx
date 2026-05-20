'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangelogEntryData } from '@/lib/changelog'

interface ChangelogFilterDetail {
  visibleIds: string[]
}

function isChangelogFilterEvent(event: Event): event is CustomEvent<ChangelogFilterDetail> {
  return event instanceof CustomEvent && Array.isArray(event.detail?.visibleIds)
}

export function ChangelogToc({ entries }: { entries: ChangelogEntryData[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? '')
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const visibleEntries = useMemo(() => {
    if (!visibleIds) return entries
    return entries.filter((entry) => visibleIds.includes(entry.id))
  }, [entries, visibleIds])

  useEffect(() => {
    const onFiltered = (event: Event) => {
      if (!isChangelogFilterEvent(event)) return
      setVisibleIds(event.detail.visibleIds)
    }
    window.addEventListener('changelog:filtered', onFiltered)
    return () => window.removeEventListener('changelog:filtered', onFiltered)
  }, [])

  useEffect(() => {
    if (visibleEntries.length === 0) {
      setActive('')
      return
    }
    if (!visibleEntries.some((entry) => entry.id === active)) {
      setActive(visibleEntries[0]?.id ?? '')
    }
  }, [active, visibleEntries])

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
    for (const e of visibleEntries) {
      const el = document.getElementById(e.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [visibleEntries])

  // Keep the active entry inside the nav's own scroll viewport so long
  // release lists don't leave the current version off-screen.
  useEffect(() => {
    const nav = navRef.current
    if (!(nav && active)) return
    const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`)
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
  }, [active])

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
