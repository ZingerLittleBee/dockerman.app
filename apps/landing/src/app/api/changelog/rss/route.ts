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
import { type ChangelogEntryData, getChangelogEntries } from '@/lib/changelog'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrapCdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

function entryToHtml(entry: ChangelogEntryData): string {
  const parts: string[] = []
  if (entry.summary) {
    parts.push(`<p>${escapeXml(entry.summary)}</p>`)
  }
  for (const section of entry.sections) {
    parts.push(`<h3>${escapeXml(section.title)}</h3>`)
    parts.push('<ul>')
    for (const item of section.items) {
      const label = item.label ? `<strong>${escapeXml(item.label)}</strong> ` : ''
      const body = escapeXml(item.description ?? item.content)
      parts.push(`<li>${label}${body}</li>`)
    }
    parts.push('</ul>')
  }
  return parts.join('\n')
}

function renderItem(
  entry: ChangelogEntryData,
  channelLink: string,
  isoDate: string | undefined
): string {
  const title = entry.title ? `v${entry.version} — ${entry.title}` : `v${entry.version}`
  const link = `${channelLink}#${entry.id}`
  // Each locale's MDX stores the date in its own display format (e.g. "2026年4月8日"),
  // which Date.parse can't read. We get the canonical date from the EN changelog
  // — version is the join key, EN is the source of truth — so pubDate stays valid.
  const pubDate = isoDate ? new Date(isoDate).toUTCString() : ''
  const lines = [
    '    <item>',
    `      <title>${escapeXml(title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`
  ]
  if (pubDate) {
    lines.push(`      <pubDate>${pubDate}</pubDate>`)
  }
  lines.push(
    `      <description>${wrapCdata(entryToHtml(entry))}</description>`,
    '    </item>'
  )
  return lines.join('\n')
}

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

  const channelTitle = `${siteConfig.name} ${t('changelog.title')}`
  const channelDesc = t('changelog.description')
  const channelLink = `${siteConfig.url}/${locale}/changelog`
  const feedSelf = `${siteConfig.url}/api/changelog/rss?locale=${locale}`
  const latestDate = entries.length > 0 ? dateByVersion.get(entries[0].version) : undefined
  const lastBuild = latestDate ? new Date(latestDate).toUTCString() : new Date().toUTCString()

  const items = entries
    .map((entry) => renderItem(entry, channelLink, dateByVersion.get(entry.version)))
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(feedSelf)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
