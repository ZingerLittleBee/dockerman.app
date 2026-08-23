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
    if (process.env.NODE_ENV !== 'production') {
      return undefined
    }

    const abortController = new AbortController()

    async function verifyAndSendPurchase() {
      try {
        const response = await fetch(`/api/checkout/verify${window.location.search}`, {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: abortController.signal
        })
        if (!response.ok) {
          return
        }

        const purchase = parseGoogleAdsPurchase(await response.json())
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
      } catch {
        // A failed verification must never be treated as a purchase.
      }
    }

    verifyAndSendPurchase().catch(() => undefined)

    return () => abortController.abort()
  }, [])

  return null
}
