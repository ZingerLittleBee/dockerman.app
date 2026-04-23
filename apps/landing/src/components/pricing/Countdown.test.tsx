import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Countdown, diff } from './Countdown'

describe('Countdown diff()', () => {
  test('zero diff when now >= target', () => {
    expect(diff(1000, 2000)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    })
  })

  test('computes days/hours/minutes/seconds for a future target', () => {
    const day = 86_400_000
    const d = diff(2 * day + 3 * 3_600_000 + 4 * 60_000 + 5000, 0)
    expect(d).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      expired: false
    })
  })
})

describe('Countdown component', () => {
  test('renders empty markup on the server (mounted gate)', () => {
    const html = renderToStaticMarkup(<Countdown deadlineUtc="2100-01-01T00:00:00Z" locale="en" />)
    expect(html).toBe('')
  })

  test('renders empty markup when deadline is already past', () => {
    const html = renderToStaticMarkup(<Countdown deadlineUtc="1970-01-01T00:00:00Z" locale="en" />)
    expect(html).toBe('')
  })
})
