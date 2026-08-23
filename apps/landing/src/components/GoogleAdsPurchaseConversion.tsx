'use client'

import { useEffect } from 'react'
import { GOOGLE_ADS_PURCHASE_DESTINATION, parseGoogleAdsPurchase } from '@/lib/analytics/googleAds'

type GoogleTag = (command: string, eventName: string, parameters: Record<string, unknown>) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GoogleTag
  }
}

export function GoogleAdsPurchaseConversion() {
  useEffect(() => {
    const purchase = parseGoogleAdsPurchase(new URLSearchParams(window.location.search))
    if (!purchase) {
      return
    }

    window.dataLayer ??= []
    window.gtag ??= (...args) => {
      window.dataLayer?.push(args)
    }
    window.gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_PURCHASE_DESTINATION,
      value: purchase.value,
      currency: purchase.currency,
      transaction_id: purchase.transactionId
    })
  }, [])

  return null
}
