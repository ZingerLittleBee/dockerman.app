import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { PlatformCard } from './PlatformCard'

const strings = {
  appleNotarized: 'Apple notarized',
  recommended: 'recommended',
  tauriSig: 'Tauri signature'
}

describe('PlatformCard', () => {
  test('keeps long recommended labels in their badge', () => {
    const markup = renderToStaticMarkup(
      <PlatformCard
        assets={[]}
        featured
        icon={<span aria-hidden="true">icon</span>}
        minSpec="macOS 11 Big Sur or later"
        strings={strings}
        title="macOS"
      />
    )

    expect(markup).toContain('recommended')
    expect(markup).toContain('ml-auto')
    expect(markup).toContain('normal-case')
    expect(markup).not.toContain('uppercase')
  })
})
