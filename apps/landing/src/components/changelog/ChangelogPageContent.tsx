import type { Locale } from '@repo/shared/i18n'
import type { ChangelogEntryData } from '@/lib/changelog'
import { ChangelogFilterProvider } from './ChangelogFilterProvider'
import { ChangelogSearch } from './ChangelogSearch'
import { ChangelogTimeline } from './ChangelogTimeline'
import { ChangelogToc } from './ChangelogToc'

interface Props {
  copy: {
    badge: string
    title: string
    description: string
    searchAriaLabel: string
    searchPlaceholder: string
  }
  entries: ChangelogEntryData[]
  locale: Locale
}

export default function ChangelogPageContent({ copy, entries, locale }: Props) {
  return (
    <ChangelogFilterProvider>
      <section className="relative overflow-hidden px-5 pt-12 pb-6 sm:px-8 sm:pt-16 sm:pb-7">
        <div className="mx-auto max-w-[1280px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-dm-line-strong bg-dm-bg-elev px-[11px] py-[5px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-2 tracking-[0.02em]">
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{
                background: 'var(--color-dm-ok)',
                boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-dm-ok) 28%, transparent)'
              }}
            />
            {copy.badge}
          </span>

          <h1 className="mt-[18px] max-w-[16ch] font-bold text-[clamp(40px,5.6vw,64px)] text-dm-ink leading-none tracking-[-0.035em]">
            {copy.title.split(',').length > 1 ? <TitleWithAccent title={copy.title} /> : copy.title}
          </h1>

          <p className="mt-[18px] max-w-[60ch] text-[16.5px] text-dm-ink-3 leading-[1.55]">
            {copy.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-[10px] border-dm-line border-b pb-7">
            <ChangelogSearch
              ariaLabel={copy.searchAriaLabel}
              placeholder={copy.searchPlaceholder}
            />
            <a
              className="ml-auto inline-flex items-center gap-[6px] rounded-[8px] border border-dm-line bg-dm-bg-elev px-[10px] py-2 font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3 no-underline hover:border-[var(--color-dm-warn)] hover:text-[var(--color-dm-warn)]"
              href={`/api/changelog/rss?locale=${locale}`}
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

      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-6 pt-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-[80px]">
            <aside className="hidden md:block">
              <div className="mb-[14px] pl-[14px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4 uppercase tracking-[0.08em]">
                Releases
              </div>
              <ChangelogToc entries={entries} />
            </aside>
            <ChangelogTimeline entries={entries} locale={locale} />
          </div>
        </div>
      </section>
    </ChangelogFilterProvider>
  )
}

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
          backgroundImage: 'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
          letterSpacing: '-0.02em'
        }}
      >
        {tail}
      </em>
    </>
  )
}
