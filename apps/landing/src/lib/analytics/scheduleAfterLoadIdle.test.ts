import { describe, expect, test } from 'bun:test'
import {
  type AfterLoadIdleHost,
  ANALYTICS_IDLE_TIMEOUT_MS,
  scheduleAfterLoadIdle
} from './scheduleAfterLoadIdle'

function createHost(readyState: DocumentReadyState, withIdleCallback = true) {
  const loadListeners: Array<() => void> = []
  const idleCallbacks: Array<() => void> = []
  const timeouts: Array<() => void> = []
  const idleOptions: Array<{ timeout?: number } | undefined> = []

  const host: AfterLoadIdleHost = {
    document: { readyState },
    addLoadListener(listener) {
      loadListeners.push(listener)
    },
    setTimeout(callback) {
      timeouts.push(callback)
      return 0
    }
  }

  if (withIdleCallback) {
    host.requestIdleCallback = (callback, options) => {
      idleCallbacks.push(callback)
      idleOptions.push(options)
      return 0
    }
  }

  return {
    host,
    idleOptions,
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
    },
    fireTimeout() {
      const callbacks = timeouts.splice(0)
      for (const callback of callbacks) {
        callback()
      }
    },
    loadCount: () => loadListeners.length,
    idleCount: () => idleCallbacks.length,
    timeoutCount: () => timeouts.length
  }
}

describe('scheduleAfterLoadIdle', () => {
  test('waits for window load and idle time before running', () => {
    const calls: string[] = []
    const env = createHost('loading')

    scheduleAfterLoadIdle(() => {
      calls.push('ran')
    }, env.host)

    expect(calls).toEqual([])
    expect(env.loadCount()).toBe(1)
    expect(env.idleCount()).toBe(0)

    env.fireLoad()
    expect(calls).toEqual([])
    expect(env.idleCount()).toBe(1)

    env.fireIdle()
    expect(calls).toEqual(['ran'])
  })

  test('schedules idle work immediately when the module loads after window.load', () => {
    const calls: string[] = []
    const env = createHost('complete')

    scheduleAfterLoadIdle(() => {
      calls.push('ran')
    }, env.host)

    expect(env.loadCount()).toBe(0)
    expect(env.idleCount()).toBe(1)
    expect(calls).toEqual([])

    env.fireIdle()
    expect(calls).toEqual(['ran'])
  })

  test('falls back to setTimeout when requestIdleCallback is missing', () => {
    const calls: string[] = []
    const env = createHost('complete', false)

    scheduleAfterLoadIdle(() => {
      calls.push('ran')
    }, env.host)

    expect(env.idleCount()).toBe(0)
    expect(env.timeoutCount()).toBe(1)
    expect(calls).toEqual([])

    env.fireTimeout()
    expect(calls).toEqual(['ran'])
  })

  test('falls back after load when requestIdleCallback is missing before load', () => {
    const calls: string[] = []
    const env = createHost('interactive', false)

    scheduleAfterLoadIdle(() => {
      calls.push('ran')
    }, env.host)

    env.fireLoad()
    expect(calls).toEqual([])
    expect(env.timeoutCount()).toBe(1)

    env.fireTimeout()
    expect(calls).toEqual(['ran'])
  })

  test('runs the task exactly once if load and idle are delivered twice', () => {
    const calls: string[] = []
    const env = createHost('loading')

    scheduleAfterLoadIdle(() => {
      calls.push('ran')
    }, env.host)

    env.fireLoad()
    env.fireLoad()
    env.fireIdle()
    env.fireIdle()

    expect(calls).toEqual(['ran'])
  })

  test('swallows sync and async task failures', async () => {
    const env = createHost('complete')

    expect(() => {
      scheduleAfterLoadIdle(() => {
        throw new Error('sync analytics failure')
      }, env.host)
      env.fireIdle()
    }).not.toThrow()

    let rejected = false
    scheduleAfterLoadIdle(() => {
      rejected = true
      return Promise.reject(new Error('async analytics failure'))
    }, env.host)
    env.fireIdle()

    await Promise.resolve()
    expect(rejected).toBe(true)
  })

  test('asks for idle time with a timeout so analytics is not starved', () => {
    const env = createHost('complete')

    scheduleAfterLoadIdle(() => undefined, env.host)

    expect(env.idleOptions).toEqual([{ timeout: ANALYTICS_IDLE_TIMEOUT_MS }])
  })
})
