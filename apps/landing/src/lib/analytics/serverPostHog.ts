import type { Locale } from '@repo/shared/i18n'
import { siteConfig } from '@/app/siteConfig'
import { withGeoIpDisabled } from '@/lib/analytics/posthogConfig'
import type { PaidPlan } from '@/lib/creem/checkoutMetadata'

const POSTHOG_CAPTURE_URL = 'https://us.i.posthog.com/capture/'
const POSTHOG_TIMEOUT_MS = 1500
const WEBSITE_HOST = new URL(siteConfig.url).host

interface CheckoutRedirectedCapture {
  distinctId: string
  event: 'checkout_redirected'
  properties: {
    locale: Locale
    plan: PaidPlan
  }
}

interface PurchaseCompletedCapture {
  distinctId: string
  event: 'purchase_completed'
  insertId: string
  properties: {
    amount_minor: number
    currency: string
    locale: Locale
    plan: PaidPlan
  }
}

type WebsiteEventCapture = CheckoutRedirectedCapture | PurchaseCompletedCapture

export async function captureWebsiteEvent(capture: WebsiteEventCapture): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    console.warn('PostHog capture skipped because NEXT_PUBLIC_POSTHOG_KEY is not configured')
    return false
  }

  const eventProperties = withGeoIpDisabled({
    ...capture.properties,
    distinct_id: capture.distinctId,
    source: 'website',
    $host: WEBSITE_HOST,
    ...(capture.event === 'purchase_completed' ? { $insert_id: capture.insertId } : {})
  })

  try {
    const response = await fetch(POSTHOG_CAPTURE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        event: capture.event,
        properties: eventProperties
      }),
      signal: AbortSignal.timeout(POSTHOG_TIMEOUT_MS)
    })

    if (!response.ok) {
      console.warn('PostHog capture failed with status:', response.status)
      return false
    }

    return true
  } catch {
    console.warn('PostHog capture failed before receiving a response')
    return false
  }
}
