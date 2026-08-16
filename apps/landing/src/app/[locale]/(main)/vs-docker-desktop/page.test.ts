import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const localesRoot = join(process.cwd(), '../../packages/shared/src/locales')

function readJson(name: string) {
  return JSON.parse(readFileSync(join(localesRoot, name), 'utf8')) as {
    meta: { home: { title: string }; compare: { title: string; description: string } }
    hero: { compareLink: string }
    nav: { compare: string }
    footer: { links: { compare: string } }
    pricing: { vsDesktop: { cta: string } }
    compare: { faq: { items: unknown[] } }
  }
}

describe('vs-docker-desktop page', () => {
  test('stays statically renderable as a server component', () => {
    const source = readFileSync(join(import.meta.dir, 'page.tsx'), 'utf8')

    expect(source.trimStart()).not.toStartWith("'use client'")
    expect(source).toContain("export const dynamic = 'error'")
    expect(source).toContain('JsonLd')
    expect(source).toContain('FAQPage')
  })

  test('every locale ships compare copy and homepage SEO', () => {
    for (const file of ['en.json', 'zh.json', 'ja.json', 'es.json']) {
      const pack = readJson(file)
      expect(pack.meta.compare.title).toBeTruthy()
      expect(pack.meta.compare.description).toBeTruthy()
      expect(pack.meta.home.title.toLowerCase()).toContain('docker desktop')
      expect(pack.hero.compareLink).toBeTruthy()
      expect(pack.nav.compare).toBeTruthy()
      expect(pack.footer.links.compare).toBeTruthy()
      expect(pack.pricing.vsDesktop.cta).toBeTruthy()
      expect(Array.isArray(pack.compare.faq.items)).toBe(true)
      expect(pack.compare.faq.items.length).toBeGreaterThan(0)
    }
  })
})
