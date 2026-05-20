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

// Defer until the browser is idle so PostHog doesn't compete with first paint
// or block input responsiveness during initial hydration.
if (typeof window !== 'undefined') {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
  }
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(initPostHog, { timeout: 4000 })
  } else {
    setTimeout(initPostHog, 2000)
  }
}
