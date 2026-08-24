import { describe, expect, mock, test } from 'bun:test'

import { createBrowserPostHogCapture } from './browserPostHog'

describe('browser PostHog capture queue', () => {
  test('queues captures until ready and flushes them once in order', () => {
    const capture = mock(() => undefined)
    const queue = createBrowserPostHogCapture()

    queue.capture('footer_theme_changed', { location: 'navbar' })
    queue.capture('page_scroll_depth', { depth: 25, page_path: '/en' })

    expect(capture).not.toHaveBeenCalled()

    queue.markReady({ capture })
    queue.markReady({ capture })

    expect(capture.mock.calls).toEqual([
      ['footer_theme_changed', { location: 'navbar' }],
      ['page_scroll_depth', { depth: 25, page_path: '/en' }]
    ])

    queue.capture('page_engaged', { page_path: '/en', duration_seconds: 10 })

    expect(capture.mock.calls).toEqual([
      ['footer_theme_changed', { location: 'navbar' }],
      ['page_scroll_depth', { depth: 25, page_path: '/en' }],
      ['page_engaged', { page_path: '/en', duration_seconds: 10 }]
    ])
  })

  test('drops queued and later captures after initialization failure', () => {
    const capture = mock(() => undefined)
    const queue = createBrowserPostHogCapture()

    queue.capture('about_social_clicked', { platform: 'github' })
    queue.markFailed()
    queue.markReady({ capture })
    queue.capture('page_engaged', { page_path: '/en' })

    expect(capture).not.toHaveBeenCalled()
  })

  test('does not deliver duplicates when markFailed is repeated after ready', () => {
    const capture = mock(() => undefined)
    const queue = createBrowserPostHogCapture()

    queue.capture('page_engaged', { duration_seconds: 10 })
    queue.markReady({ capture })
    queue.markFailed()
    queue.markFailed()

    expect(capture).toHaveBeenCalledTimes(1)
  })

  test('keeps flushing remaining events when one capture throws', () => {
    const capture = mock((event: string) => {
      if (event === 'footer_theme_changed') {
        throw new Error('capture failed')
      }
    })
    const queue = createBrowserPostHogCapture()

    queue.capture('footer_theme_changed', { location: 'navbar' })
    queue.capture('page_scroll_depth', { depth: 50 })

    expect(() => queue.markReady({ capture })).not.toThrow()
    expect(capture.mock.calls.map((call) => call[0])).toEqual([
      'footer_theme_changed',
      'page_scroll_depth'
    ])
  })
})
