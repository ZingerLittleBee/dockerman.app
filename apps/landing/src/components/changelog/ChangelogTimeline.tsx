import type { Locale } from '@repo/shared/i18n'
import type { ChangelogBlock, ChangelogEntryData, ChangelogSection } from '@/lib/changelog'
import { ChangelogCallout } from './ChangelogCallout'
import { ChangelogFigure } from './ChangelogFigure'

interface ChangelogTimelineProps {
  entries: ChangelogEntryData[]
  locale: Locale
}

export function ChangelogTimeline({ entries, locale: _locale }: ChangelogTimelineProps) {
  return (
    <div className="space-y-16">
      {entries.map((entry, i) => (
        <ReleaseArticle entry={entry} isLatest={i === 0} key={entry.id} />
      ))}
    </div>
  )
}

function ReleaseArticle({ entry, isLatest }: { entry: ChangelogEntryData; isLatest: boolean }) {
  return (
    <article className="scroll-mt-24" id={entry.id}>
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-dm-line-strong bg-dm-bg-elev px-3 py-[3px] font-[var(--font-dm-mono)] font-semibold text-[12px] text-dm-ink">
          v{entry.version}
        </span>
        <span className="text-[13px] text-dm-ink-3">{entry.date}</span>
        {isLatest && (
          <span className="rounded-full bg-dm-ink px-2 py-[2px] font-[var(--font-dm-mono)] font-semibold text-[10px] text-dm-bg tracking-wide">
            LATEST
          </span>
        )}
      </header>
      <h2 className="mb-3 font-bold text-[32px] text-dm-ink leading-[1.05] tracking-[-0.02em]">
        {entry.title}
      </h2>
      {entry.summary && (
        <p className="mb-6 max-w-[70ch] text-[16px] text-dm-ink-2">{entry.summary}</p>
      )}
      {/* Blocks (Callouts + Figures) render first, in source order. */}
      <Blocks blocks={entry.blocks} />
      {/* Sections render as headings + bullet lists. */}
      <div className="md-body space-y-8">
        {entry.sections.map((s) => (
          <SectionBlock key={s.id} section={s} />
        ))}
      </div>
    </article>
  )
}

function Blocks({ blocks }: { blocks: ChangelogBlock[] }) {
  if (blocks.length === 0) return null
  return (
    <div className="mb-6">
      {blocks.map((b, i) =>
        b.kind === 'callout' ? (
          <ChangelogCallout body={b.body} key={i} type={b.type} />
        ) : (
          <ChangelogFigure caption={b.caption} key={i} src={b.src} />
        )
      )}
    </div>
  )
}

function SectionBlock({ section }: { section: ChangelogSection }) {
  return (
    <section>
      <h3 className="mb-3 font-semibold text-[18px] text-dm-ink">{section.title}</h3>
      <ul className="space-y-2">
        {section.items.map((item, i) => (
          <li className="relative pl-5 text-[14px] text-dm-ink-2" key={i}>
            <span
              aria-hidden
              className="absolute top-[8px] left-0 h-[6px] w-[6px] rounded-full"
              style={{ background: 'var(--color-dm-accent)' }}
            />
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label && <strong className="text-dm-ink">{item.label}: </strong>}
            <span>{item.description ?? (item.label ? '' : item.content)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
