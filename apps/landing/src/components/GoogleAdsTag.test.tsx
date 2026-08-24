import { describe, expect, test } from 'bun:test'
import { Children, isValidElement, type ReactElement } from 'react'
import { GOOGLE_ADS_ID } from '@/lib/analytics/googleAds'
import { GoogleAdsTag } from './GoogleAdsTag'

interface ScriptProps {
  id?: string
  src?: string
  strategy?: string
  children?: string
}

function googleAdsScripts() {
  const tree = GoogleAdsTag() as ReactElement<{ children?: unknown }>
  return Children.toArray(tree.props.children).filter(isValidElement) as ReactElement<ScriptProps>[]
}

describe('GoogleAdsTag', () => {
  test('bootstraps the gtag queue before loading the Ads library on idle', () => {
    const [queue, library] = googleAdsScripts()

    expect(queue?.props.id).toBe('google-ads-tag')
    expect(queue?.props.strategy).toBe('afterInteractive')
    expect(queue?.props.src).toBeUndefined()
    expect(queue?.props.children).toContain('window.dataLayer = window.dataLayer || []')
    expect(queue?.props.children).toContain('window.gtag = window.gtag || gtag')
    expect(queue?.props.children).toContain(`gtag('config', '${GOOGLE_ADS_ID}')`)

    expect(library?.props.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`)
    expect(library?.props.strategy).toBe('lazyOnload')
  })
})
