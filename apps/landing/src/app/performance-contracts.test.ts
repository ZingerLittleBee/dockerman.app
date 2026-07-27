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
    const source = readAppFile('instrumentation-client.ts')
    const posthogKeyGuard = source.indexOf('if (!posthogKey)')
    const posthogImport = source.indexOf("import('posthog-js')")

    expect(source).not.toContain("import posthog from 'posthog-js'")
    expect(posthogKeyGuard).toBeGreaterThan(-1)
    expect(posthogImport).toBeGreaterThan(posthogKeyGuard)
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
