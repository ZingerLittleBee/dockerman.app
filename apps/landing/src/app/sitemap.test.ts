import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('sitemap', () => {
  test('includes the Docker Desktop comparison route', () => {
    const source = readFileSync(join(import.meta.dir, 'sitemap.ts'), 'utf8')

    expect(source).toContain("'/vs-docker-desktop'")
    expect(source).toContain("route === '/vs-docker-desktop'")
  })
})
