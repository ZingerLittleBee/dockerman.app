import { createPostHogConfig } from './src/lib/analytics/posthogConfig'

const initPostHog = async () => {
  const { default: posthog } = await import('posthog-js')

  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    createPostHogConfig(
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
      process.env.NODE_ENV === 'development'
    )
  )
}

initPostHog()
