export const ANALYTICS_IDLE_TIMEOUT_MS = 2000
const IDLE_FALLBACK_DELAY_MS = 1

export interface AfterLoadIdleHost {
  document: Pick<Document, 'readyState'>
  addLoadListener: (listener: () => void) => void
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => unknown
  setTimeout: (callback: () => void, delay: number) => unknown
}

function createBrowserAfterLoadIdleHost(): AfterLoadIdleHost {
  return {
    document,
    addLoadListener(listener) {
      window.addEventListener('load', listener, { once: true })
    },
    requestIdleCallback:
      typeof window.requestIdleCallback === 'function'
        ? (callback, options) => window.requestIdleCallback(callback, options)
        : undefined,
    setTimeout: (callback, delay) => {
      window.setTimeout(callback, delay)
    }
  }
}

export function scheduleAfterLoadIdle(task: () => unknown, host?: AfterLoadIdleHost) {
  const runtime = host ?? createBrowserAfterLoadIdleHost()
  let started = false

  const run = () => {
    if (started) {
      return
    }

    started = true

    try {
      const result = task()
      if (result instanceof Promise) {
        result.catch(() => undefined)
      }
    } catch {
      // Analytics failures should not throw into the page.
    }
  }

  const runWhenIdle = () => {
    if (runtime.requestIdleCallback) {
      runtime.requestIdleCallback(run, { timeout: ANALYTICS_IDLE_TIMEOUT_MS })
      return
    }

    runtime.setTimeout(run, IDLE_FALLBACK_DELAY_MS)
  }

  if (runtime.document.readyState === 'complete') {
    // Client modules can evaluate after window.load; still idle-init in that case.
    runWhenIdle()
    return
  }

  runtime.addLoadListener(runWhenIdle)
}
