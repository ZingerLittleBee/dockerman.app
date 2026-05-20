import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ChangelogEntryData } from '@/lib/changelog'
import ChangelogPageContent from './ChangelogPageContent'

const entry: ChangelogEntryData = {
  blocks: [],
  date: '2026-04-02',
  id: 'release-v4-7-0',
  images: [],
  sections: [
    {
      id: 'release-v4-7-0-feature',
      items: [{ content: 'Added.' }],
      title: '新功能',
      tone: 'feature'
    }
  ],
  summary: 'A test entry.',
  title: 'Version 4.7.0',
  version: '4.7.0'
}

const copy = {
  badge: '更新日志',
  description: '关注产品更新。',
  searchAriaLabel: '搜索更新日志',
  searchPlaceholder: '搜索版本、功能、修复...',
  title: '产品更新'
}

describe('ChangelogPageContent', () => {
  test('renders badge, title, description in header', () => {
    const markup = renderToStaticMarkup(
      <ChangelogPageContent copy={copy} entries={[entry]} locale="zh" />
    )
    expect(markup).toContain(copy.badge)
    expect(markup).toContain(copy.title)
    expect(markup).toContain(copy.description)
  })

  test('renders entry article id in the timeline', () => {
    const markup = renderToStaticMarkup(
      <ChangelogPageContent copy={copy} entries={[entry]} locale="zh" />
    )
    expect(markup).toContain('id="release-v4-7-0"')
  })
})
