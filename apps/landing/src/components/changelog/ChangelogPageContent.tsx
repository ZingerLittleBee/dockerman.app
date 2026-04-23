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
        ...e.sections.flatMap((s) => s.items.map((i) => i.content)),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(query)
    })
  }, [entries, query])

  return (
    <>
      {/* page-head: kicker + italic-accent title + sub + toolbar */}
      <section className="relative px-8 pt-16 pb-7">
        <div className="mx-auto max-w-[1180px]">
          {/* kicker */}
          <span className="inline-flex items-center gap-2 rounded-full border border-dm-line-strong bg-dm-bg-elev px-[11px] py-[5px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-2 tracking-[0.02em]">
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{
                background: 'var(--color-dm-ok)',
                boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-dm-ok) 28%, transparent)',
              }}
            />
            {copy.badge}
          </span>

          <h1 className="mt-[18px] max-w-[16ch] font-bold text-[clamp(40px,5.6vw,64px)] text-dm-ink leading-none tracking-[-0.035em]">
            {copy.title.split(',').length > 1 ? (
              <TitleWithAccent title={copy.title} />
            ) : (
              copy.title
            )}
          </h1>

          <p className="mt-[18px] max-w-[60ch] text-[16.5px] text-dm-ink-3 leading-[1.55]">
            {copy.description}
          </p>

          {/* toolbar */}
          <div className="mt-7 flex flex-wrap items-center gap-[10px] border-dm-line border-b pb-7">
            <ChangelogSearch onQuery={setQuery} />
            <a
              className="ml-auto inline-flex items-center gap-[6px] rounded-[8px] border border-dm-line bg-dm-bg-elev px-[10px] py-2 font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3 no-underline hover:border-[var(--color-dm-warn)] hover:text-[var(--color-dm-warn)]"
              href="/api/changelog/rss"
            >
              <svg
                fill="none"
                height="12"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" fill="currentColor" r="1.5" />
              </svg>
              RSS
            </a>
          </div>
        </div>
      </section>

      {/* Layout: 220px TOC + releases */}
      <section className="px-8 pb-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-[72px] pt-8">
            <aside className="hidden md:block">
              <div
                className="mb-[14px] pl-[14px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4 uppercase tracking-[0.08em]"
              >
                Releases
              </div>
              <ChangelogToc entries={filtered} />
            </aside>
            <ChangelogTimeline entries={filtered} locale={locale} />
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * Best-effort: render the portion after a comma in italic-serif accent.
 * Original design uses "Every commit, <em>in plain English.</em>".
 */
function TitleWithAccent({ title }: { title: string }) {
  const idx = title.indexOf(',')
  if (idx === -1) return <>{title}</>
  const head = title.slice(0, idx + 1)
  const tail = title.slice(idx + 1).trim()
  return (
    <>
      {head}{' '}
      <em
        className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
          letterSpacing: '-0.02em',
        }}
      >
        {tail}
      </em>
    </>
  )
}
