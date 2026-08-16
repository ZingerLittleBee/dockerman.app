import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const localesRoot = join(process.cwd(), '../../packages/shared/src/locales')

function readJson(name: string) {
  return JSON.parse(readFileSync(join(localesRoot, name), 'utf8')) as {
    meta: { home: { title: string; description: string }; compare: { title: string; description: string } }
    hero: { compareLink: string; description: string }
    nav: { compare: string }
    footer: { links: { compare: string } }
    pricing: { vsDesktop: { cta: string } }
    compare: {
      faq: { items: unknown[] }
      hero: { description: string }
      table: { rows: { k8s: { dockerman: string } } }
      desktopWins: { body: string }
    }
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

  test('does not mark Kubernetes or local Docker as paid', () => {
    const paidMarkers = /Paid:|付费：|有料：|De pago:/i
    const vagueLocalFree = /Local use is free forever|本地使用永久免费|ローカル利用は永久無料|el uso local es gratis para siempre/i

    for (const file of ['en.json', 'zh.json', 'ja.json', 'es.json']) {
      const pack = readJson(file)
      expect(pack.compare.table.rows.k8s.dockerman).not.toMatch(paidMarkers)
      expect(pack.compare.desktopWins.body).not.toMatch(/without paying|而不需要为|支払わなくても|sin pagar las/)
      expect(pack.hero.description).not.toMatch(vagueLocalFree)
      expect(pack.meta.home.description).not.toMatch(vagueLocalFree)
      expect(pack.compare.hero.description).not.toMatch(/Local Docker and Podman stay free forever|本地 Docker 与 Podman 永久免费/)
    }
  })
})
