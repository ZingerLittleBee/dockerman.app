import type { BeforeSendFn, PostHogConfig, Properties } from 'posthog-js'

export function withGeoIpDisabled(properties: Properties) {
  return {
    ...properties,
    $geoip_disable: true
  }
}

const disableGeoIpEnrichment: BeforeSendFn = (captureResult) => {
  if (!captureResult) {
    return null
  }

  return {
    ...captureResult,
    properties: withGeoIpDisabled(captureResult.properties)
  }
}

export function createPostHogConfig(uiHost: string | undefined, debug: boolean) {
  return {
    api_host: '/ingest',
    ui_host: uiHost,
    defaults: '2025-11-30',
    capture_exceptions: true,
    // Vercel Speed Insights already captures Core Web Vitals; avoid double instrumentation.
    capture_performance: false,
    before_send: disableGeoIpEnrichment,
    debug
  } satisfies Partial<PostHogConfig>
}
