import {
  type BrowserEventProperties,
  type BrowserPostHogCaptureSeam,
  markBrowserPostHogFailed,
  markBrowserPostHogReady
} from '@repo/shared/analytics/browserPostHog'
import { createPostHogConfig } from './posthogConfig'

interface PostHogClient {
  init: (apiKey: string, config: ReturnType<typeof createPostHogConfig>) => void
  capture: (event: string, properties?: BrowserEventProperties) => unknown
}

export interface BrowserPostHogDependencies {
  getKey: () => string | undefined
  getHost: () => string | undefined
  isDebug: () => boolean
  importPostHog: () => Promise<{ default: PostHogClient }>
  captureSeam?: BrowserPostHogCaptureSeam
}

const defaultCaptureSeam: BrowserPostHogCaptureSeam = {
  markReady: markBrowserPostHogReady,
  markFailed: markBrowserPostHogFailed
}

export function createBrowserPostHogInitializer(dependencies: BrowserPostHogDependencies) {
  let started = false
  const captureSeam = dependencies.captureSeam ?? defaultCaptureSeam

  return async function initBrowserPostHog() {
    if (started) {
      return
    }

    const posthogKey = dependencies.getKey()
    if (!posthogKey) {
      started = true
      captureSeam.markFailed()
      return
    }

    started = true

    try {
      const { default: posthog } = await dependencies.importPostHog()
      posthog.init(posthogKey, createPostHogConfig(dependencies.getHost(), dependencies.isDebug()))
      captureSeam.markReady(posthog)
    } catch {
      captureSeam.markFailed()
    }
  }
}

export function createProductionBrowserPostHogInitializer() {
  return createBrowserPostHogInitializer({
    getKey: () => process.env.NEXT_PUBLIC_POSTHOG_KEY,
    getHost: () => process.env.NEXT_PUBLIC_POSTHOG_HOST,
    isDebug: () => process.env.NODE_ENV === 'development',
    importPostHog: () => import('posthog-js')
  })
}
