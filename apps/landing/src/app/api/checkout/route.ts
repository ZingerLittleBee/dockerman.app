import { type NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/app/siteConfig'
import { captureWebsiteEvent } from '@/lib/analytics/serverPostHog'
import { getPaidPlanConfig, normalizeLocale, parsePaidPlan } from '@/lib/creem/checkoutMetadata'
import { isRecord } from '@/lib/typeGuards'

const CREEM_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.creem.io' : 'https://test-api.creem.io'

export function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const plan = parsePaidPlan(searchParams.get('plan'))
  const locale = normalizeLocale(searchParams.get('locale'))

  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan parameter' }, { status: 400 })
  }

  const { productId, discountCode } = getPaidPlanConfig(plan)
  if (!productId) {
    return NextResponse.json({ error: 'Product ID not configured' }, { status: 500 })
  }

  const apiKey = process.env.CREEM_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
  }

  const requestId = crypto.randomUUID()
  const successUrl = new URL(`/${locale}/pricing/success`, siteConfig.url)
  successUrl.searchParams.set('transaction_id', requestId)
  successUrl.searchParams.set('plan', plan)
  const body = {
    product_id: productId,
    success_url: successUrl.toString(),
    request_id: requestId,
    metadata: { plan, locale },
    ...(discountCode ? { discount_code: discountCode } : {})
  }

  try {
    const response = await fetch(`${CREEM_BASE_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      console.error('Creem checkout failed with status:', response.status)
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: response.status }
      )
    }

    const checkout: unknown = await response.json()

    if (!isRecord(checkout) || typeof checkout.checkout_url !== 'string') {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 })
    }

    await captureWebsiteEvent({
      event: 'checkout_redirected',
      distinctId: requestId,
      properties: { plan, locale }
    })

    return NextResponse.redirect(checkout.checkout_url, 303)
  } catch {
    console.error('Creem checkout failed before receiving a response')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
