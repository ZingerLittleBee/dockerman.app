import type { Locale } from '@repo/shared/i18n'

const DAY = 86_400_000
const WINDOW_DAYS = 365
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const EN_DATE = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/

export const INTL_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  es: 'es-ES'
}

/** Parses an English changelog date such as "Nov 23, 2026" to a UTC timestamp. */
export function parseChangelogDate(value: string): number | null {
  const match = EN_DATE.exec(value.trim())
  if (!match) return null
  const month = MONTHS.indexOf(match[1])
  if (month < 0) return null
  return Date.UTC(Number(match[3]), month, Number(match[2]))
}

export type ReleaseKind = 'major' | 'feature' | 'fix'

export function releaseKind(version: string): ReleaseKind {
  const [, minor = 0, patch = 0] = version.split('.').map(Number)
  if (minor === 0 && patch === 0) return 'major'
  return patch === 0 ? 'feature' : 'fix'
}

export interface Release {
  version: string
  /** UTC midnight timestamp of the release day. */
  date: number
}

export interface CadenceTick {
  version: string
  kind: ReleaseKind
  latest: boolean
  /** Labels near the plot edges anchor inward instead of centring. */
  edge: 'start' | 'end' | null
  /** Horizontal position in percent. */
  left: number
  /** Order within the window, oldest first; staggers the entrance. */
  index: number
}

export interface Cadence {
  ticks: CadenceTick[]
  months: { label: string; year: boolean; left: number }[]
  latest: Release
  latestLeft: number
  /** Releases inside the trailing 12-month window. */
  count: number
  /** Median days between consecutive releases in the window. */
  medianGap: number
}

/**
 * Lays out the trailing year of releases ending at the newest one. Anchoring the window to the
 * latest release (not "now") keeps the statically built page stable between deploys.
 */
export function buildCadence(releases: Release[], locale: Locale): Cadence | null {
  const sorted = [...releases].sort((a, b) => b.date - a.date)
  const latest = sorted[0]
  if (!latest) return null

  const end = latest.date
  const start = end - WINDOW_DAYS * DAY
  const inWindow = sorted.filter((r) => r.date >= start).reverse()
  const pos = (time: number) =>
    Math.min(99.6, Math.max(0.4, ((time - start) / (end - start)) * 100))

  const ticks = inWindow.map((release, index): CadenceTick => {
    const left = pos(release.date)
    return {
      version: release.version,
      kind: releaseKind(release.version),
      latest: release === latest,
      edge: left > 94 ? 'end' : left < 6 ? 'start' : null,
      left,
      index
    }
  })

  const gaps = inWindow
    .slice(1)
    .map((release, i) => (release.date - inWindow[i].date) / DAY)
    .sort((a, b) => a - b)
  const medianGap = gaps.length > 0 ? Math.round(gaps[Math.floor(gaps.length / 2)]) : 0

  const monthFormat = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: 'short',
    timeZone: 'UTC'
  })
  const first = new Date(start)
  const months: Cadence['months'] = []
  for (let k = 1; k <= 12; k++) {
    const time = Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + k, 1)
    if (time > end) break
    const date = new Date(time)
    const year = date.getUTCMonth() === 0
    months.push({
      label: year ? String(date.getUTCFullYear()) : monthFormat.format(date),
      year,
      left: pos(time)
    })
  }

  return { ticks, months, latest, latestLeft: pos(latest.date), count: inWindow.length, medianGap }
}

/** Short release date for cards, e.g. "Nov 23" or "11月23日". */
export function formatReleaseDay(time: number, locale: Locale) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(time))
}
