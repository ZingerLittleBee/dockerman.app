import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ChangelogEntryData } from '@/lib/changelog'
import ChangelogTimeline from './ChangelogTimeline'

const fullWidthTimelineEntryPattern =
  /<div(?=[^>]*id="release-v4-7-0")(?=[^>]*class="[^"]*\bw-full\b[^"]*")[^>]*>/
const changelogImageRadiusPattern =
  /<img(?=[^>]*alt="文件预览")(?=[^>]*class="[^"]*\brounded-lg\b[^"]*")[^>]*>/

const entry: ChangelogEntryData = {
  date: '2026-04-02',
  id: 'release-v4-7-0',
  images: [],
  sections: [
    {
      id: 'release-v4-7-0-feature',
      items: [{ content: 'Added a layout fix.' }],
      title: '新功能',
      tone: 'feature'
    }
  ],
  summary: 'A test entry.',
  title: 'Version 4.7.0',
  version: 'v4.7.0'
}

const entryWithImage: ChangelogEntryData = {
  ...entry,
  id: 'release-v4-4-0',
  images: [
    {
      alt: '文件预览',
      src: '/changelog/2.1.0.png'
    }
  ]
}

describe('ChangelogTimeline layout', () => {
  test('renders each timeline entry at full width', () => {
    const markup = renderToStaticMarkup(<ChangelogTimeline entries={[entry]} locale="zh" />)

    expect(markup).toMatch(fullWidthTimelineEntryPattern)
  })

  test('renders changelog images with a smaller corner radius', () => {
    const markup = renderToStaticMarkup(
      <ChangelogTimeline entries={[entryWithImage]} locale="zh" />
    )

    expect(markup).toMatch(changelogImageRadiusPattern)
  })
})
