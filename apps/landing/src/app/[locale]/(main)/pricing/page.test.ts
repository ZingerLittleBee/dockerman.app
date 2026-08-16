import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const localesRoot = join(process.cwd(), '../../packages/shared/src/locales')

function readJson(name: string) {
  return JSON.parse(readFileSync(join(localesRoot, name), 'utf8')) as {
    pricing: {
      plans: {
        free: { description: string; features: { k8s: string; cloudflared: string } }
      }
      compare: { description: string }
    }
  }
}

describe('pricing page paid-feature copy', () => {
  test('treats Kubernetes and Cloudflared as included on Free', () => {
    const page = readFileSync(join(import.meta.dir, 'page.tsx'), 'utf8')
    const table = readFileSync(
      join(process.cwd(), 'src/components/pricing/ComparisonTable.tsx'),
      'utf8'
    )

    expect(page).toContain("id: 'k8s', label: t('pricing.plans.free.features.k8s')")
    expect(page).toContain("id: 'cloudflared', label: t('pricing.plans.free.features.cloudflared')")
    expect(page).not.toContain("t('pricing.plans.team.features.k8s')")
    expect(page).not.toContain("t('pricing.plans.solo.features.k8s')")
    expect(table).toContain("{ key: 'k8s', hasDesc: true, free: true, team: true, solo: true }")
    expect(table).toContain(
      "{ key: 'cloudflared', hasDesc: true, free: true, team: true, solo: true }"
    )
    expect(table).not.toMatch(/key: 'k8s'[\s\S]*free: false/)
  })

  test('every locale says paid plans add remote hosts only', () => {
    for (const file of ['en.json', 'zh.json', 'ja.json', 'es.json']) {
      const pack = readJson(file)
      expect(pack.pricing.plans.free.features.k8s).toBeTruthy()
      expect(pack.pricing.plans.free.features.cloudflared).toBeTruthy()
      expect(pack.pricing.plans.free.description).not.toMatch(
        /Local Docker and Podman only|仅支持本地 Docker 与 Podman|ローカル Docker と Podman のみ|Solo Docker y Podman locales/
      )
      expect(pack.pricing.compare.description).not.toMatch(/priority support|优先支持|優先サポート/)
    }
  })
})
