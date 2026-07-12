import { NextResponse } from 'next/server'

import { captureWebsiteEvent } from '@/lib/analytics/serverPostHog'
import { parseVerifiedCreemWebhook } from '@/lib/creem/webhook'

export async function POST(request: Request) {
  const secret = process.env.CREEM_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const signature = request.headers.get('creem-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const rawBody = await request.text()
  const result = parseVerifiedCreemWebhook(rawBody, signature, secret)

  if (result.kind === 'invalid-signature') {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (result.kind === 'invalid-payload') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (result.kind === 'ignored') {
    return NextResponse.json({ received: true })
  }

  const { purchase } = result
  const captured = await captureWebsiteEvent({
    event: 'purchase_completed',
    distinctId: purchase.requestId,
    insertId: `purchase:${purchase.requestId}`,
    properties: {
      plan: purchase.plan,
      locale: purchase.locale,
      amount_minor: purchase.amountMinor,
      currency: purchase.currency
    }
  })

  if (!captured) {
    return NextResponse.json({ error: 'Analytics delivery failed' }, { status: 503 })
  }

  return NextResponse.json({ received: true })
}
