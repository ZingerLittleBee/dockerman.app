'use client'

import type { Locale } from '@repo/shared/i18n'
import { useMemo, useState } from 'react'
import type { ChangelogEntryData } from '@/lib/changelog'
import { ChangelogSearch } from './ChangelogSearch'
import { ChangelogTimeline } from './ChangelogTimeline'
import { ChangelogToc } from './ChangelogToc'

interface Props {
  copy: { badge: string; title: string; description: string }
  entries: ChangelogEntryData[]
  locale: Locale
}

export default function ChangelogPageContent({ copy, entries, locale }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return entries
    return entries.filter((e) => {
      const hay = [
        e.version,
        e.title,
        e.summary,
        ...e.sections.flatMap((s) => s.items.map((i) => i.content))
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(query)
    })
  }, [entries, query])

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-16">
      <header className="mb-10">
        <div className="font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4 uppercase tracking-wider">
          {copy.badge}
        </div>
        <h1 className="mt-2 font-bold text-[48px] text-dm-ink leading-none tracking-[-0.03em]">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-[60ch] text-[15px] text-dm-ink-2">{copy.description}</p>
      </header>

      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <div>
          <ChangelogSearch onQuery={setQuery} />
          <div className="mt-4">
            <ChangelogToc entries={filtered} />
          </div>
        </div>
        <ChangelogTimeline entries={filtered} locale={locale} />
      </div>
    </div>
  )
}
