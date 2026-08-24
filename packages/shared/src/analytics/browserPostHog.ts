export type BrowserCaptureEvent =
  | 'about_social_clicked'
  | 'footer_theme_changed'
  | 'page_engaged'
  | 'page_scroll_depth'

export type BrowserEventPropertyValue = string | number | boolean | null | undefined

export type BrowserEventProperties = Record<string, BrowserEventPropertyValue>

export interface PostHogCaptureClient {
  capture: (event: string, properties?: BrowserEventProperties) => unknown
}

export interface BrowserPostHogCaptureSeam {
  markReady: (client: PostHogCaptureClient) => void
  markFailed: () => void
}

interface QueuedCapture {
  event: string
  properties?: BrowserEventProperties
}

type CaptureState =
  | { kind: 'pending'; queue: QueuedCapture[] }
  | { kind: 'ready'; client: PostHogCaptureClient }
  | { kind: 'failed' }

function deliver(client: PostHogCaptureClient, event: string, properties?: BrowserEventProperties) {
  try {
    client.capture(event, properties)
  } catch {
    // Analytics failures should never break the page.
  }
}

// posthog-js 1.336.4 does not queue capture() before init.
export function createBrowserPostHogCapture() {
  let state: CaptureState = { kind: 'pending', queue: [] }

  return {
    capture(event: string, properties?: BrowserEventProperties) {
      if (state.kind === 'ready') {
        deliver(state.client, event, properties)
        return
      }

      if (state.kind === 'pending') {
        state.queue.push({ event, properties })
      }
    },
    markReady(client: PostHogCaptureClient) {
      if (state.kind !== 'pending') {
        return
      }

      const queued = state.queue.splice(0)
      state = { kind: 'ready', client }

      for (const item of queued) {
        deliver(client, item.event, item.properties)
      }
    },
    markFailed() {
      if (state.kind !== 'pending') {
        return
      }

      state = { kind: 'failed' }
    }
  }
}

const browserPostHogCapture = createBrowserPostHogCapture()

export function captureBrowserEvent(
  event: BrowserCaptureEvent,
  properties?: BrowserEventProperties
) {
  browserPostHogCapture.capture(event, properties)
}

export function markBrowserPostHogReady(client: PostHogCaptureClient) {
  browserPostHogCapture.markReady(client)
}

export function markBrowserPostHogFailed() {
  browserPostHogCapture.markFailed()
}
