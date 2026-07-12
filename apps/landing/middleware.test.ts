import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'

import { middleware } from './middleware'

describe('landing middleware', () => {
  test('lets PostHog proxy requests reach the rewrite layer', () => {
    const request = new NextRequest('https://dockerman.app/ingest/e/', {
      method: 'POST'
    })

    const response = middleware(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  test('keeps similarly prefixed pages in locale routing', () => {
    const request = new NextRequest('https://dockerman.app/ingestion')

    const response = middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://dockerman.app/en/ingestion')
  })
})
