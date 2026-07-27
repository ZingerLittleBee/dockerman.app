import { createPostHogConfig } from './src/lib/analytics/posthogConfig'

const initPostHog = async () => {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

  if (!posthogKey) {
    return
  }

  const { default: posthog } = await import('posthog-js')

  posthog.init(
    posthogKey,
    createPostHogConfig(
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
      process.env.NODE_ENV === 'development'
    )
  )
}

void initPostHog().catch(() => {
  // Analytics failures should not block app initialization.
})
