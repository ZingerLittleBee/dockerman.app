import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ChangelogEntryData } from '@/lib/changelog'
import ChangelogPageContent from './ChangelogPageContent'

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

const copy = {
  badge: '更新日志',
  description: '关注产品更新。',
  subscribe: {
    button: '订阅',
    description: '获取更新。',
    error: '出错了',
    fallbackSuccess: '已处理',
    notice: '暂无订阅功能',
    placeholder: '邮箱',
    success: '已订阅',
    title: '订阅更新'
  },
  title: '产品更新'
}

describe('ChangelogPageContent', () => {
  test('hides the subscribe form by default', () => {
    const markup = renderToStaticMarkup(
      <ChangelogPageContent copy={copy} entries={[entry]} locale="zh" />
    )

    expect(markup).not.toContain(copy.subscribe.title)
  })

  test('renders the subscribe form above the timeline when enabled', () => {
    const markup = renderToStaticMarkup(
      <ChangelogPageContent copy={copy} entries={[entry]} locale="zh" showSubscribeForm />
    )

    expect(markup).toContain(copy.subscribe.title)
    expect(markup.indexOf(copy.subscribe.title)).toBeLessThan(markup.indexOf(entry.id))
  })
})
