import { describe, expect, mock, test } from 'bun:test'

mock.module('server-only', () => ({}))

const { buildRssFeed, entryToHtml, escapeXml, renderItem, wrapCdata } = await import('./rss')
const { parseEntry } = await import('./changelog')

const sampleEntry = parseEntry(
  'v1.2.0',
  '2026-04-08',
  '## Big Update\n\nlede line.\n\n### Features\n\n- <Bold>New</Bold>: shiny thing\n- plain item'
)

describe('escapeXml', () => {
  test('escapes the five XML predefined entities', () => {
    expect(escapeXml(`<a href="x">A & B's 'quoted'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;A &amp; B&apos;s &apos;quoted&apos;&lt;/a&gt;'
    )
  })

  test('preserves unicode and emoji', () => {
    expect(escapeXml('最新动态 ✨')).toBe('最新动态 ✨')
  })

  test('escapes ampersands before other entities to avoid double-encoding', () => {
    expect(escapeXml('&lt;')).toBe('&amp;lt;')
  })
})

describe('wrapCdata', () => {
  test('wraps a normal payload', () => {
    expect(wrapCdata('<p>hi</p>')).toBe('<![CDATA[<p>hi</p>]]>')
  })

  test('splits embedded ]]> across two CDATA sections', () => {
    const wrapped = wrapCdata('a]]>b')
    expect(wrapped).toBe('<![CDATA[a]]]]><![CDATA[>b]]>')
    // sanity: no raw "]]>" remains inside a single CDATA section
    expect(wrapped.match(/\]\]>/g)?.length).toBe(2) // closing of first section + closing of second
  })
})

describe('entryToHtml', () => {
  test('emits <p>, <h3>, <ul><li> structure for a parsed entry', () => {
    const html = entryToHtml(sampleEntry)
    expect(html).toContain('<p>lede line.</p>')
    expect(html).toContain('<h3>Features</h3>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<strong>New</strong>')
    expect(html).toContain('<li>plain item</li>')
  })

  test('omits the summary paragraph when summary is empty', () => {
    const entry = parseEntry('v1.0.0', '2026-04-08', '## Title\n\n### Features\n\n- only')
    const html = entryToHtml(entry)
    expect(html.startsWith('<p>')).toBe(false)
    expect(html).toContain('<h3>Features</h3>')
  })

  test('escapes XML entities in section titles and item bodies', () => {
    const entry = parseEntry(
      'v1.0.0',
      '2026-04-08',
      '## T\n\nlede & more.\n\n### Fixes & wins\n\n- a < b'
    )
    const html = entryToHtml(entry)
    expect(html).toContain('<h3>Fixes &amp; wins</h3>')
    expect(html).toContain('lede &amp; more.')
    expect(html).toContain('a &lt; b')
  })
})

describe('renderItem', () => {
  test('produces title, link, guid, pubDate, description in order', () => {
    const xml = renderItem(sampleEntry, 'https://dockerman.app/en/changelog', '2026-04-08')
    expect(xml).toContain('<title>v1.2.0 — Big Update</title>')
    expect(xml).toContain('<link>https://dockerman.app/en/changelog#release-1-2-0</link>')
    expect(xml).toContain(
      '<guid isPermaLink="true">https://dockerman.app/en/changelog#release-1-2-0</guid>'
    )
    expect(xml).toContain('<pubDate>Wed, 08 Apr 2026 00:00:00 GMT</pubDate>')
    expect(xml).toContain('<description><![CDATA[')
  })

  test('drops the version-only suffix when the entry has no title', () => {
    const titleless = parseEntry('v9.9.9', '2026-04-08', '### Features\n\n- item')
    const xml = renderItem(titleless, 'https://dockerman.app/en/changelog', '2026-04-08')
    expect(xml).toContain('<title>v9.9.9</title>')
  })

  test('omits pubDate when isoDate is undefined', () => {
    const xml = renderItem(sampleEntry, 'https://dockerman.app/en/changelog', undefined)
    expect(xml).not.toContain('<pubDate>')
  })
})

describe('buildRssFeed', () => {
  const baseInput = {
    locale: 'en',
    channelTitle: 'Dockerman Changelog',
    channelDescription: 'Latest releases',
    channelLink: 'https://dockerman.app/en/changelog',
    feedSelfUrl: 'https://dockerman.app/api/changelog/rss?locale=en',
    entries: [sampleEntry],
    dateByVersion: new Map([['1.2.0', '2026-04-08']])
  }

  test('produces a well-formed RSS 2.0 envelope', () => {
    const xml = buildRssFeed(baseInput)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
    expect(xml.trimEnd().endsWith('</rss>')).toBe(true)
  })

  test('includes channel-level metadata', () => {
    const xml = buildRssFeed(baseInput)
    expect(xml).toContain('<title>Dockerman Changelog</title>')
    expect(xml).toContain('<link>https://dockerman.app/en/changelog</link>')
    expect(xml).toContain('<description>Latest releases</description>')
    expect(xml).toContain('<language>en</language>')
    expect(xml).toContain(
      '<atom:link href="https://dockerman.app/api/changelog/rss?locale=en" rel="self" type="application/rss+xml"/>'
    )
  })

  test('uses the latest entry’s ISO date for lastBuildDate', () => {
    const xml = buildRssFeed(baseInput)
    expect(xml).toContain('<lastBuildDate>Wed, 08 Apr 2026 00:00:00 GMT</lastBuildDate>')
  })

  test('falls back to current time for lastBuildDate when no dates are known', () => {
    const before = Date.now()
    const xml = buildRssFeed({ ...baseInput, dateByVersion: new Map() })
    const match = xml.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/)
    expect(match).not.toBeNull()
    if (match) {
      const ts = new Date(match[1]).getTime()
      expect(ts).toBeGreaterThanOrEqual(before - 1000)
      expect(ts).toBeLessThanOrEqual(Date.now() + 1000)
    }
  })

  test('emits one <item> per entry', () => {
    const second = parseEntry('v1.1.0', '2026-04-01', '## Earlier\n\nold news.\n\n### Fixes\n\n- y')
    const xml = buildRssFeed({
      ...baseInput,
      entries: [sampleEntry, second],
      dateByVersion: new Map([
        ['1.2.0', '2026-04-08'],
        ['1.1.0', '2026-04-01']
      ])
    })
    expect(xml.match(/<item>/g)?.length).toBe(2)
    expect(xml).toContain('<title>v1.2.0 — Big Update</title>')
    expect(xml).toContain('<title>v1.1.0 — Earlier</title>')
  })

  test('escapes XML entities in channel-level fields', () => {
    const xml = buildRssFeed({
      ...baseInput,
      channelTitle: 'A & B',
      channelDescription: '<unsafe>',
      feedSelfUrl: 'https://x/?a=1&b=2'
    })
    expect(xml).toContain('<title>A &amp; B</title>')
    expect(xml).toContain('<description>&lt;unsafe&gt;</description>')
    expect(xml).toContain('href="https://x/?a=1&amp;b=2"')
  })

  test('renders an item-less channel when entries is empty', () => {
    const xml = buildRssFeed({ ...baseInput, entries: [], dateByVersion: new Map() })
    expect(xml).not.toContain('<item>')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
  })

  test('localizes the language tag and channel link', () => {
    const xml = buildRssFeed({
      ...baseInput,
      locale: 'zh',
      channelLink: 'https://dockerman.app/zh/changelog',
      feedSelfUrl: 'https://dockerman.app/api/changelog/rss?locale=zh'
    })
    expect(xml).toContain('<language>zh</language>')
    expect(xml).toContain('<link>https://dockerman.app/zh/changelog</link>')
  })
})
