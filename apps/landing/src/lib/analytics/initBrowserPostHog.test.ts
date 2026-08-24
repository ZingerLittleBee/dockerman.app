import { describe, expect, mock, test } from 'bun:test'
import { createBrowserPostHogCapture } from '@repo/shared/analytics/browserPostHog'
import { createBrowserPostHogInitializer } from './initBrowserPostHog'
import { type AfterLoadIdleHost, scheduleAfterLoadIdle } from './scheduleAfterLoadIdle'

function createDependencies(overrides?: {
  key?: string | undefined
  host?: string
  debug?: boolean
}) {
  const posthog = {
    init: mock(() => undefined),
    capture: mock(() => undefined)
  }
  const importPostHog = mock(() => Promise.resolve({ default: posthog }))
  const captureSeam = createBrowserPostHogCapture()

  return {
    posthog,
    importPostHog,
    captureSeam,
    dependencies: {
      getKey: () => overrides?.key,
      getHost: () => overrides?.host,
      isDebug: () => overrides?.debug ?? false,
      importPostHog,
      captureSeam
    }
  }
}

function createLoadIdleHost(readyState: DocumentReadyState) {
  const loadListeners: Array<() => void> = []
  const idleCallbacks: Array<() => void> = []

  const host: AfterLoadIdleHost = {
    document: { readyState },
    addLoadListener(listener) {
      loadListeners.push(listener)
    },
    requestIdleCallback(callback) {
      idleCallbacks.push(callback)
      return 0
    },
    setTimeout(callback) {
      idleCallbacks.push(callback)
      return 0
    }
  }

  return {
    host,
    fireLoad() {
      for (const listener of loadListeners) {
        listener()
      }
    },
    fireIdle() {
      const callbacks = idleCallbacks.splice(0)
      for (const callback of callbacks) {
        callback()
      }
    }
  }
}

describe('createBrowserPostHogInitializer', () => {
  test('does not import PostHog until init runs', () => {
    const { importPostHog, dependencies } = createDependencies({ key: 'phc_test' })
    createBrowserPostHogInitializer(dependencies)

    expect(importPostHog).not.toHaveBeenCalled()
  })

  test('skips the dynamic import when no key is configured', async () => {
    const { importPostHog, posthog, captureSeam, dependencies } = createDependencies({
      key: undefined
    })
    const init = createBrowserPostHogInitializer(dependencies)

    captureSeam.capture('page_engaged', { page_path: '/en' })
    await init()
    captureSeam.capture('page_scroll_depth', { depth: 25 })

    expect(importPostHog).not.toHaveBeenCalled()
    expect(posthog.init).not.toHaveBeenCalled()
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  test('imports and initializes PostHog exactly once', async () => {
    const { importPostHog, posthog, dependencies } = createDependencies({
      key: 'phc_test',
      host: 'https://us.i.posthog.com',
      debug: false
    })
    const init = createBrowserPostHogInitializer(dependencies)

    await Promise.all([init(), init()])
    await init()

    expect(importPostHog).toHaveBeenCalledTimes(1)
    expect(posthog.init).toHaveBeenCalledTimes(1)
    expect(posthog.init.mock.calls[0]?.[0]).toBe('phc_test')
    expect(posthog.init.mock.calls[0]?.[1]).toMatchObject({
      api_host: '/ingest',
      ui_host: 'https://us.i.posthog.com',
      capture_exceptions: true,
      capture_performance: false,
      debug: false
    })
  })

  test('does not retry after a failed dynamic import', async () => {
    const importPostHog = mock(() => Promise.reject(new Error('offline')))
    const posthog = {
      init: mock(() => undefined),
      capture: mock(() => undefined)
    }
    const captureSeam = createBrowserPostHogCapture()
    const init = createBrowserPostHogInitializer({
      getKey: () => 'phc_test',
      getHost: () => undefined,
      isDebug: () => false,
      importPostHog,
      captureSeam
    })

    captureSeam.capture('about_social_clicked', { platform: 'github' })
    await expect(init()).resolves.toBeUndefined()
    await expect(init()).resolves.toBeUndefined()
    captureSeam.capture('page_engaged', { page_path: '/en' })

    expect(importPostHog).toHaveBeenCalledTimes(1)
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  test('delivers captures queued before the load/idle boundary exactly once after init', async () => {
    const { importPostHog, posthog, captureSeam, dependencies } = createDependencies({
      key: 'phc_test'
    })
    const init = createBrowserPostHogInitializer(dependencies)
    const env = createLoadIdleHost('loading')
    let inFlight: Promise<void> | undefined

    scheduleAfterLoadIdle(() => {
      inFlight = init()
    }, env.host)

    captureSeam.capture('footer_theme_changed', { location: 'navbar' })
    captureSeam.capture('page_scroll_depth', { depth: 25, page_path: '/en' })

    expect(importPostHog).not.toHaveBeenCalled()
    expect(posthog.capture).not.toHaveBeenCalled()

    env.fireLoad()
    env.fireIdle()
    await inFlight

    expect(importPostHog).toHaveBeenCalledTimes(1)
    expect(posthog.init).toHaveBeenCalledTimes(1)
    expect(posthog.capture.mock.calls).toEqual([
      ['footer_theme_changed', { location: 'navbar' }],
      ['page_scroll_depth', { depth: 25, page_path: '/en' }]
    ])

    captureSeam.capture('page_engaged', { page_path: '/en', duration_seconds: 10 })
    expect(posthog.capture).toHaveBeenCalledTimes(3)
  })
})
