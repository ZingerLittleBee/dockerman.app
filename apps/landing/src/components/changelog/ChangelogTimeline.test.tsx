import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ChangelogEntryData } from '@/lib/changelog'
import { ChangelogTimeline } from './ChangelogTimeline'

const entry: ChangelogEntryData = {
  blocks: [],
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
  version: '4.7.0'
}

describe('ChangelogTimeline', () => {
  test('renders each entry inside an <article> keyed by id', () => {
    const markup = renderToStaticMarkup(<ChangelogTimeline entries={[entry]} locale="zh" />)
    expect(markup).toContain('id="release-v4-7-0"')
    expect(markup).toContain('Version 4.7.0')
  })

  test('renders v<version> in the header', () => {
    const markup = renderToStaticMarkup(<ChangelogTimeline entries={[entry]} locale="zh" />)
    expect(markup).toContain('v4.7.0')
  })

  test('marks the first entry as LATEST', () => {
    const markup = renderToStaticMarkup(<ChangelogTimeline entries={[entry]} locale="zh" />)
    expect(markup).toContain('LATEST')
  })

  test('renders entry summary', () => {
    const markup = renderToStaticMarkup(<ChangelogTimeline entries={[entry]} locale="zh" />)
    expect(markup).toContain('A test entry.')
  })
})
