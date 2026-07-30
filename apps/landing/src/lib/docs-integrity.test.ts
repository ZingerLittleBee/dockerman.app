import { describe, expect, test } from 'bun:test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const docsRoot = join(process.cwd(), 'content', 'docs')
const locales = ['en', 'zh', 'ja', 'es'] as const

function mdxFiles(root: string): string[] {
  return readdirSync(root)
    .flatMap((entry) => {
      const path = join(root, entry)
      return statSync(path).isDirectory() ? mdxFiles(path) : [path]
    })
    .filter((path) => path.endsWith('.mdx'))
}

function localeSlugs(locale: (typeof locales)[number]): string[] {
  const localeRoot = join(docsRoot, locale)
  return mdxFiles(localeRoot)
    .map((path) => relative(localeRoot, path).split(sep).join('/'))
    .sort()
}

function routeToDocument(route: string): string {
  const [, locale, , ...segments] = route.split('/')
  const page = segments.length === 0 ? 'index' : segments.join('/')
  const directPage = join(docsRoot, locale, `${page}.mdx`)
  return existsSync(directPage) ? directPage : join(docsRoot, locale, page, 'index.mdx')
}

describe('documentation integrity', () => {
  test('all locales publish the same page set', () => {
    const english = localeSlugs('en')

    for (const locale of locales.slice(1)) {
      expect(localeSlugs(locale)).toEqual(english)
    }
  })

  test('obsolete guide pages and screenshot placeholders stay removed', () => {
    for (const locale of locales) {
      const guidesRoot = join(docsRoot, locale, 'guides')
      expect(existsSync(guidesRoot) ? mdxFiles(guidesRoot) : []).toEqual([])
    }

    for (const path of mdxFiles(docsRoot)) {
      expect(readFileSync(path, 'utf8')).not.toContain('TODO(screenshot)')
    }
  })

  test('internal documentation routes resolve in every locale', () => {
    const unresolved: string[] = []
    const linkPattern = /\]\((\/(?:en|zh|ja|es)\/docs(?:\/[^)#?\s]+)?)(?:#[^)\s]+)?\)/g

    for (const path of mdxFiles(docsRoot)) {
      const source = readFileSync(path, 'utf8')

      for (const match of source.matchAll(linkPattern)) {
        const route = match[1]
        if (!(route && existsSync(routeToDocument(route)))) {
          unresolved.push(`${relative(docsRoot, path)} -> ${route ?? '<missing>'}`)
        }
      }
    }

    expect(unresolved).toEqual([])
  })

  test('known misleading command examples do not return', () => {
    const source = mdxFiles(docsRoot)
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n')

    for (const staleExample of [
      '--config ./run.json',
      'dockerman container list --json',
      '"page_size"',
      'dockerman container ls'
    ]) {
      expect(source).not.toContain(staleExample)
    }
  })
})
