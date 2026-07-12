const initPostHog = async () => {
  const { default: posthog } = await import('posthog-js')

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30',
    capture_exceptions: true,
    // Vercel Speed Insights already captures Core Web Vitals; avoid double instrumentation.
    capture_performance: false,
    debug: process.env.NODE_ENV === 'development'
  })
}

initPostHog()
