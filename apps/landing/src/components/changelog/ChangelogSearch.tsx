'use client'

import { useEffect } from 'react'

export function ChangelogSearch({ onQuery }: { onQuery: (query: string) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        ;(document.getElementById('changelog-search') as HTMLInputElement | null)?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative">
      <input
        className="w-full rounded-md border border-dm-line bg-dm-bg-elev px-3 py-2 text-[13px] text-dm-ink placeholder:text-dm-ink-4"
        id="changelog-search"
        onChange={(e) => onQuery(e.currentTarget.value.toLowerCase())}
        placeholder="Search releases… (⌘K)"
        type="search"
      />
    </div>
  )
}
