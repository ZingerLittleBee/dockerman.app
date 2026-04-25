/**
 * GET /api/changelog/rss
 *
 * RSS 2.0 feed for the Dockerman changelog. One feed per locale.
 *
 * Query Parameters:
 *   - locale (optional): "en" | "zh" | "ja" | "es" — defaults to "en".
 */
import { defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { NextRequest } from 'next/server'
import { siteConfig } from '@/app/siteConfig'
import { getChangelogEntries } from '@/lib/changelog'
import { buildRssFeed } from '@/lib/rss'

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get('locale') ?? defaultLocale
  const locale: Locale = (locales as readonly string[]).includes(requested)
    ? (requested as Locale)
    : defaultLocale

  const { t } = await getTranslation(locale)
  const [entries, enEntries] = await Promise.all([
    getChangelogEntries(locale),
    locale === 'en' ? Promise.resolve(null) : getChangelogEntries('en')
  ])

  const dateByVersion = new Map<string, string>()
  for (const entry of enEntries ?? entries) {
    dateByVersion.set(entry.version, entry.date)
  }

  const xml = buildRssFeed({
    locale,
    channelTitle: `${siteConfig.name} ${t('changelog.title')}`,
    channelDescription: t('changelog.description'),
    channelLink: `${siteConfig.url}/${locale}/changelog`,
    feedSelfUrl: `${siteConfig.url}/api/changelog/rss?locale=${locale}`,
    entries,
    dateByVersion
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
