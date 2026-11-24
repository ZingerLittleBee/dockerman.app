import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { getChangelogEntries } from '@/lib/changelog'
import { buildCadence, formatReleaseDay, parseChangelogDate, type Release } from './cadence'
import type { HomeT } from './copy'
import s from './home.module.css'
import { ArrowRight, cn, SectionTitle } from './primitives'

// Patch releases use the base tick style.
const KIND_CLASS = { major: s.kMa, feature: s.kMi, fix: undefined }
const RECENT = 3

/**
 * Release cadence built from the changelog MDX at build time. English entries carry
 * machine-readable dates; the visitor's locale supplies the titles.
 */
export async function ReleasesSection({ locale, t }: { locale: Locale; t: HomeT }) {
  const [englishEntries, entries] = await Promise.all([
    getChangelogEntries('en'),
    getChangelogEntries(locale)
  ])

  const releases: Release[] = englishEntries.flatMap((entry) => {
    const date = parseChangelogDate(entry.date)
    return date === null ? [] : [{ version: entry.version, date }]
  })
  const cadence = buildCadence(releases, locale)
  if (!cadence) return null

  const dateOf = new Map(releases.map((release) => [release.version, release.date]))
  const changelog = `/${locale}/changelog`
  const recent = entries.slice(0, RECENT).map((entry) => {
    const date = dateOf.get(entry.version)
    return {
      version: entry.version,
      title: entry.title,
      href: `${changelog}#${entry.id}`,
      day: date === undefined ? entry.date : formatReleaseDay(date, locale)
    }
  })

  return (
    <section className={cn(s.wrap, s.sec, s.cs)} id="releases">
      <div className={s.top2}>
        <SectionTitle lead={t('home.releases.titleLead')} trail={t('home.releases.titleTrail')} />
        <div className={cn(s.relSt, s.rv)}>
          <div>
            <b>
              <span className="sr-only">{cadence.count}</span>
              <span
                aria-hidden="true"
                className={s.cnt}
                style={{ '--dmh-n': cadence.count } as CSSProperties}
              />
            </b>
            {t('home.releases.count')}
          </div>
          <div>
            <b>
              <span className="sr-only">{cadence.medianGap}</span>
              <span
                aria-hidden="true"
                className={s.cnt}
                style={{ '--dmh-n': cadence.medianGap } as CSSProperties}
              />
            </b>
            {t('home.releases.gap')}
          </div>
        </div>
      </div>
      <div className={cn(s.cad, s.rv)}>
        <div className={s.cadPlot}>
          <span aria-hidden="true" className={s.cadBase} />
          {cadence.ticks.map((tick) => (
            <span
              className={cn(
                s.tk,
                KIND_CLASS[tick.kind],
                tick.latest && s.last,
                tick.edge === 'end' && s.edgeR,
                tick.edge === 'start' && s.edgeL
              )}
              key={tick.version}
              style={{ left: `${tick.left}%`, '--i': tick.index } as CSSProperties}
            >
              <i />
              <em className={s.mono}>v{tick.version}</em>
            </span>
          ))}
          <span className={s.cadNow} style={{ left: `${cadence.latestLeft}%` }}>
            <b className={s.lt}>{t('home.releases.latest')}</b>
            <span className={s.mono}>v{cadence.latest.version}</span>
          </span>
        </div>
        <div aria-hidden="true" className={s.cadAx}>
          {cadence.months.map((month) => (
            <span
              className={cn(month.year && s.yr)}
              key={month.left}
              style={{ left: `${month.left}%` }}
            >
              {month.label}
            </span>
          ))}
        </div>
        <div className={s.cadLg}>
          <span className={s.lgMa}>{t('home.releases.major')}</span>
          <span className={s.lgMi}>{t('home.releases.feature')}</span>
          <span>{t('home.releases.fix')}</span>
          <Link href={changelog}>
            {t('home.releases.all')}
            <ArrowRight />
          </Link>
        </div>
      </div>
      <div className={s.rls}>
        {recent.map((release, i) => (
          <Link className={cn(s.rlsC, i === 0 && s.on)} href={release.href} key={release.version}>
            <span className={s.rlsTop}>
              <span className={s.mono}>v{release.version}</span>
              <span>{release.day}</span>
            </span>
            <span className={s.rlsT}>{release.title}</span>
            <ArrowRight />
          </Link>
        ))}
      </div>
    </section>
  )
}
