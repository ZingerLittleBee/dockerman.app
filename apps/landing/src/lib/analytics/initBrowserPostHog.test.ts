import { describe, expect, mock, test } from 'bun:test'
import { createBrowserPostHogInitializer } from './initBrowserPostHog'

function createDependencies(overrides?: {
  key?: string | undefined
  host?: string
  debug?: boolean
}) {
  const posthog = { init: mock(() => undefined) }
  const importPostHog = mock(() => Promise.resolve({ default: posthog }))

  return {
    posthog,
    importPostHog,
    dependencies: {
      getKey: () => overrides?.key,
      getHost: () => overrides?.host,
      isDebug: () => overrides?.debug ?? false,
      importPostHog
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
    const { importPostHog, posthog, dependencies } = createDependencies({ key: undefined })
    const init = createBrowserPostHogInitializer(dependencies)

    await init()

    expect(importPostHog).not.toHaveBeenCalled()
    expect(posthog.init).not.toHaveBeenCalled()
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
    const init = createBrowserPostHogInitializer({
      getKey: () => 'phc_test',
      getHost: () => undefined,
      isDebug: () => false,
      importPostHog
    })

    await expect(init()).rejects.toThrow('offline')
    await expect(init()).resolves.toBeUndefined()
    expect(importPostHog).toHaveBeenCalledTimes(1)
  })
})
