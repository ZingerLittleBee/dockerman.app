import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.cwd()

function readAppFile(path: string) {
  return readFileSync(join(appDir, path), 'utf8')
}

describe('landing performance contracts', () => {
  test('download page stays statically renderable', () => {
    const source = readAppFile('src/app/[locale]/(main)/download/page.tsx')

    expect(source).not.toContain("from 'next/headers'")
    expect(source).toContain("export const dynamic = 'error'")
  })

  test('changelog shell remains a server component', () => {
    const source = readAppFile('src/components/changelog/ChangelogPageContent.tsx')

    expect(source.trimStart()).not.toStartWith("'use client'")
  })

  test('browser instrumentation defers PostHog out of the initial module graph', () => {
    const instrumentation = readAppFile('instrumentation-client.ts')
    const initializer = readAppFile('src/lib/analytics/initBrowserPostHog.ts')
    const posthogKeyGuard = initializer.indexOf('if (!posthogKey)')
    const posthogImport = initializer.indexOf("import('posthog-js')")

    expect(instrumentation).not.toContain("import posthog from 'posthog-js'")
    expect(instrumentation).not.toContain("import('posthog-js')")
    expect(instrumentation).toContain('scheduleAfterLoadIdle(initPostHog)')
    expect(initializer).not.toContain("import posthog from 'posthog-js'")
    expect(posthogKeyGuard).toBeGreaterThan(-1)
    expect(initializer.indexOf('dependencies.importPostHog()')).toBeGreaterThan(posthogKeyGuard)
    expect(posthogImport).toBeGreaterThan(posthogKeyGuard)
  })

  test('Google Ads library is not preloaded on the first-paint path', () => {
    const tag = readAppFile('src/components/GoogleAdsTag.tsx')
    const layout = readAppFile('src/app/layout.tsx')

    expect(tag).toContain('www.googletagmanager.com/gtag/js')
    expect(tag).toContain('strategy="afterInteractive"')
    expect(tag).toContain('strategy="lazyOnload"')
    expect(layout).toContain("process.env.NODE_ENV === 'production' ? <GoogleAdsTag /> : null")
  })

  test('production builds upload PostHog source maps when credentials are available', () => {
    const source = readAppFile('next.config.mjs')

    expect(source).toContain("from '@posthog/nextjs-config'")
    expect(source).toContain('process.env.POSTHOG_API_KEY')
    expect(source).toContain('process.env.POSTHOG_PROJECT_ID')
    expect(source).toContain('withPostHogConfig(landingConfig')
  })

  test('download homebrew block keeps locale resources out of the client bundle', () => {
    const source = readAppFile('src/components/download/HomebrewBlock.tsx')

    expect(source.trimStart()).not.toStartWith("'use client'")
    expect(source).not.toContain("from '@repo/shared/i18n/client'")
  })
})
