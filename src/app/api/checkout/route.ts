import { type NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/app/siteConfig'

const CREEM_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.creem.io'
    : 'https://test-api.creem.io'

const PLAN_CONFIG: Record<string, { productId?: string; discountCode?: string }> = {
  '1-device': {
    productId: process.env.CREEM_PRODUCT_ID_1_DEVICE,
    discountCode: process.env.CREEM_DISCOUNT_CODE_1_DEVICE
  },
  '3-devices': {
    productId: process.env.CREEM_PRODUCT_ID_3_DEVICES,
    discountCode: process.env.CREEM_DISCOUNT_CODE_3_DEVICES
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const plan = searchParams.get('plan')
  const locale = searchParams.get('locale') ?? 'en'

  if (!plan || !PLAN_CONFIG[plan]) {
    return NextResponse.json({ error: 'Invalid plan parameter' }, { status: 400 })
  }

  const { productId, discountCode } = PLAN_CONFIG[plan]
  if (!productId) {
    return NextResponse.json({ error: 'Product ID not configured' }, { status: 500 })
  }

  const apiKey = process.env.CREEM_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
  }

  const successUrl = `${siteConfig.url}/${locale}/pricing/success`

  const body: Record<string, unknown> = {
    product_id: productId,
    success_url: successUrl,
    request_id: `${plan}-${Date.now()}`
  }

  if (discountCode) {
    body.discount_code = discountCode
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
      const error = await response.text()
      console.error('Creem checkout error:', response.status, error)
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: response.status }
      )
    }

    const checkout = await response.json()

    if (!checkout.checkout_url) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 })
    }

    return NextResponse.redirect(checkout.checkout_url)
  } catch (error) {
    console.error('Creem checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
