import type { ChangelogEntryData } from './changelog'

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function wrapCdata(value: string): string {
  // CDATA cannot contain ']]>'; split it across two CDATA sections.
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

export function entryToHtml(entry: ChangelogEntryData): string {
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

export function renderItem(
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

export interface RssFeedInput {
  locale: string
  channelTitle: string
  channelDescription: string
  channelLink: string
  feedSelfUrl: string
  entries: ChangelogEntryData[]
  dateByVersion: Map<string, string>
}

export function buildRssFeed(input: RssFeedInput): string {
  const {
    locale,
    channelTitle,
    channelDescription,
    channelLink,
    feedSelfUrl,
    entries,
    dateByVersion
  } = input

  const latestDate = entries.length > 0 ? dateByVersion.get(entries[0].version) : undefined
  const lastBuild = latestDate ? new Date(latestDate).toUTCString() : new Date().toUTCString()

  const items = entries
    .map((entry) => renderItem(entry, channelLink, dateByVersion.get(entry.version)))
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(feedSelfUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
}
