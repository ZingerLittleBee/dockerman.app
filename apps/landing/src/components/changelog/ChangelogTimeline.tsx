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
    <div className="flex min-w-0 flex-col gap-20">
      {entries.map((entry, i) => (
        <div key={entry.id}>
          <ReleaseArticle entry={entry} isLatest={i === 0} />
          {i < entries.length - 1 ? (
            <div
              aria-hidden="true"
              className="mt-20 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--color-dm-line-strong) 25%, var(--color-dm-line-strong) 75%, transparent)',
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}

function ReleaseArticle({ entry, isLatest }: { entry: ChangelogEntryData; isLatest: boolean }) {
  // Extract major version for the circle badge: "5.1.0" -> "5".
  const major = entry.version.split('.')[0] ?? ''
  return (
    <article className="scroll-mt-[100px]" id={entry.id}>
      <div className="mb-5 flex flex-wrap items-center gap-3 font-[var(--font-dm-mono)] text-[12px]">
        <VersionPill major={major} version={entry.version} highlighted={isLatest} />
        <span className="text-dm-ink-3">{entry.date}</span>
        {isLatest ? (
          <span
            className="rounded px-2 py-[3px] font-semibold text-[10.5px] uppercase tracking-[0.05em]"
            style={{ background: 'var(--color-dm-ok)', color: '#000' }}
          >
            LATEST
          </span>
        ) : null}
      </div>
      <h2 className="m-0 mb-4 max-w-[22ch] font-bold text-[clamp(30px,3.6vw,40px)] text-dm-ink leading-[1.08] tracking-[-0.03em]">
        <TitleMaybeAccent title={entry.title} />
      </h2>
      {entry.summary ? (
        <p className="mb-6 max-w-[70ch] text-[16px] text-dm-ink-2">{entry.summary}</p>
      ) : null}

      {/* Blocks (Callouts + Figures) render first, in source order. */}
      <Blocks blocks={entry.blocks} />

      {/* Sections render as headings + bullet lists. */}
      <div className="md-body flex flex-col gap-8">
        {entry.sections.map((s) => (
          <SectionBlock key={s.id} section={s} />
        ))}
      </div>
    </article>
  )
}

function VersionPill({
  major,
  version,
  highlighted,
}: {
  major: string
  version: string
  highlighted: boolean
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-[11px] py-[5px] pl-[5px] font-semibold text-[12.5px] text-dm-ink"
      style={
        highlighted
          ? {
              borderColor:
                'color-mix(in srgb, var(--color-dm-accent-2) 40%, var(--color-dm-line-strong))',
              background:
                'color-mix(in srgb, var(--color-dm-accent-2) 10%, var(--color-dm-bg-elev))',
            }
          : {
              borderColor: 'var(--color-dm-line-strong)',
              background: 'var(--color-dm-bg-elev)',
            }
      }
    >
      <span
        className="grid h-[18px] w-[18px] place-items-center rounded-full font-bold text-[10px] text-white"
        style={
          highlighted
            ? {
                background:
                  'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
                boxShadow:
                  '0 4px 10px -3px color-mix(in srgb, var(--color-dm-accent-2) 50%, transparent)',
              }
            : { background: 'var(--color-dm-ink-4)' }
        }
      >
        {major}
      </span>
      v{version}
    </span>
  )
}

/**
 * Render the portion after a period as italic-serif accent, when present.
 * e.g. "Podman, properly. Plus a faster engine swap." becomes
 *      "Podman, properly. <em>Plus a faster engine swap.</em>".
 * We skip version-style numbers (e.g. "Version 4.7.0") by requiring that
 * the character before the period is not a digit and the tail is non-trivial.
 */
function TitleMaybeAccent({ title }: { title: string }) {
  // find first period that is preceded by a non-digit and followed by space+letters
  for (let idx = 0; idx < title.length; idx++) {
    if (title[idx] !== '.') continue
    const prev = title[idx - 1] ?? ''
    if (/\d/.test(prev)) continue
    if (idx === title.length - 1) continue
    const tail = title.slice(idx + 1).trim()
    if (tail.length === 0) continue
    const head = title.slice(0, idx + 1)
    return (
      <>
        {head}{' '}
        <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic tracking-[-0.01em]">
          {tail}
        </em>
      </>
    )
  }
  return <>{title}</>
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
      <h3 className="mt-4 mb-3 flex items-center gap-3 font-bold text-[22px] text-dm-ink leading-[1.25] tracking-[-0.022em]">
        <span
          aria-hidden="true"
          className="inline-block h-[18px] w-[4px] rounded-[2px]"
          style={{
            background:
              'linear-gradient(180deg, var(--color-dm-accent-2), #8b5cf6)',
          }}
        />
        {section.title}
      </h3>
      <ul className="m-0 list-none p-0">
        {section.items.map((item, i) => (
          <li
            className="relative py-[4px] pl-[26px] text-[14px] text-dm-ink-2"
            key={i}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-[6px] font-bold text-[22px] leading-[1.3]"
              style={{ color: 'var(--color-dm-accent-2)' }}
            >
              ·
            </span>
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label && <strong className="text-dm-ink">{item.label}: </strong>}
            <span>{item.description ?? (item.label ? '' : item.content)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
