import { type NextRequest, NextResponse } from 'next/server'

const CHANGELOG_SUBSCRIBE_WEBHOOK_TOKEN = process.env.CHANGELOG_SUBSCRIBE_WEBHOOK_TOKEN
const CHANGELOG_SUBSCRIBE_WEBHOOK_URL = process.env.CHANGELOG_SUBSCRIBE_WEBHOOK_URL
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const supportEmail = 'support@dockerman.app'

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = typeof body === 'object' && body && 'email' in body ? body.email : undefined
  if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!CHANGELOG_SUBSCRIBE_WEBHOOK_URL) {
    const subject = encodeURIComponent('Subscribe me to Dockerman changelog updates')
    const message = encodeURIComponent(
      `Please subscribe this email to Dockerman changelog updates:\n\n${normalizedEmail}`
    )

    return NextResponse.json({
      href: `mailto:${supportEmail}?subject=${subject}&body=${message}`,
      mode: 'mailto'
    })
  }

  try {
    const response = await fetch(CHANGELOG_SUBSCRIBE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        ...(CHANGELOG_SUBSCRIBE_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${CHANGELOG_SUBSCRIBE_WEBHOOK_TOKEN}` }
          : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: normalizedEmail,
        source: 'landing-changelog',
        subscribedAt: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Changelog subscribe webhook error:', response.status, error)
      return NextResponse.json({ error: 'Failed to subscribe email' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Changelog subscribe webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
