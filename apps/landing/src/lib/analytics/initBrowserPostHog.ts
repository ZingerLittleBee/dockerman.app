import { createPostHogConfig } from './posthogConfig'

interface PostHogClient {
  init: (apiKey: string, config: ReturnType<typeof createPostHogConfig>) => void
}

export interface BrowserPostHogDependencies {
  getKey: () => string | undefined
  getHost: () => string | undefined
  isDebug: () => boolean
  importPostHog: () => Promise<{ default: PostHogClient }>
}

export function createBrowserPostHogInitializer(dependencies: BrowserPostHogDependencies) {
  let started = false

  return async function initBrowserPostHog() {
    if (started) {
      return
    }

    const posthogKey = dependencies.getKey()
    if (!posthogKey) {
      return
    }

    started = true

    const { default: posthog } = await dependencies.importPostHog()
    posthog.init(posthogKey, createPostHogConfig(dependencies.getHost(), dependencies.isDebug()))
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
