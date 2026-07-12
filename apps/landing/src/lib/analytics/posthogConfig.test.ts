import { describe, expect, test } from 'bun:test'

import { createPostHogConfig, withGeoIpDisabled } from './posthogConfig'

describe('PostHog browser configuration', () => {
  test('marks every event to skip GeoIP enrichment', () => {
    const config = createPostHogConfig('https://us.i.posthog.com', false)
    const captureResult = config.before_send?.({
      uuid: 'event-id',
      event: 'test_event',
      properties: { existing_property: 'preserved' }
    })

    expect(captureResult?.properties).toEqual({
      existing_property: 'preserved',
      $geoip_disable: true
    })
  })

  test('marks server event properties to skip GeoIP enrichment', () => {
    expect(withGeoIpDisabled({ plan: '1-device', locale: 'en' })).toEqual({
      plan: '1-device',
      locale: 'en',
      $geoip_disable: true
    })
  })
})
