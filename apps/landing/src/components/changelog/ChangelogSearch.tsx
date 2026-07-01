'use client'

import { use, useEffect } from 'react'
import { ChangelogFilterContext } from './ChangelogFilterContext'

const CHANGELOG_ENTRY_SELECTOR = '[data-changelog-entry]'
const CHANGELOG_SEARCH_INPUT_ID = 'changelog-search'

function applyChangelogFilter(query: string) {
  const normalized = query.trim().toLowerCase()
  const entries = Array.from(document.querySelectorAll<HTMLElement>(CHANGELOG_ENTRY_SELECTOR))
  const visibleIds: string[] = []

  for (const entry of entries) {
    const matches =
      normalized.length === 0 || (entry.textContent ?? '').toLowerCase().includes(normalized)
    entry.hidden = !matches
    if (matches) visibleIds.push(entry.id)
  }

  return normalized.length === 0 ? null : visibleIds
}

export function ChangelogSearch({
  ariaLabel,
  placeholder
}: {
  ariaLabel: string
  placeholder: string
}) {
  const filter = use(ChangelogFilterContext)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        ;(document.getElementById(CHANGELOG_SEARCH_INPUT_ID) as HTMLInputElement | null)?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <label className="flex min-w-[280px] max-w-[480px] flex-1 items-center gap-[10px] rounded-[10px] border border-dm-line-strong bg-dm-bg-elev px-[14px] py-[9px] font-[var(--font-dm-mono)] text-[13px] text-dm-ink-2 focus-within:border-[var(--color-dm-accent-2)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-dm-accent-2)_18%,transparent)]">
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'var(--color-dm-ink-3)' }}
        viewBox="0 0 24 24"
        width="14"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        aria-label={ariaLabel}
        className="flex-1 border-0 bg-transparent font-[var(--font-dm-mono)] text-[13px] text-dm-ink outline-none placeholder:text-dm-ink-4"
        id={CHANGELOG_SEARCH_INPUT_ID}
        onChange={(e) => filter?.setVisibleIds(applyChangelogFilter(e.currentTarget.value))}
        placeholder={placeholder}
        type="search"
      />
      <span className="rounded border border-dm-line bg-dm-bg-soft px-[6px] py-[2px] font-[var(--font-dm-mono)] text-[10.5px] text-dm-ink-3">
        ⌘ K
      </span>
    </label>
  )
}
