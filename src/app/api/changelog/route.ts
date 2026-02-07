import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/app/siteConfig'

function extractVersionEntry(content: string, version: string): string | null {
  const normalizedVersion = version.startsWith('v') ? version : `v${version}`
  const entryRegex = new RegExp(
    `<ChangelogEntry\\s+version="${normalizedVersion}"[^>]*>([\\s\\S]*?)</ChangelogEntry>`,
    'm'
  )
  const match = content.match(entryRegex)
  if (!match) return null
  return match[1].trim()
}

function mdxToMarkdown(mdx: string): string {
  const baseUrl = siteConfig.url
  return mdx
    .replace(/<Bold>(.*?)<\/Bold>/g, '**$1**')
    .replace(/<ChangelogImage\s+src="([^"]+)"\s+alt="([^"]+)"\s*\/>/g, `![$2](${baseUrl}$1)`)
    .replace(
      /<ChangelogImage\s*\n\s*src="([^"]+)"\s*\n\s*alt="([^"]+)"\s*\n\s*\/>/g,
      `![$2](${baseUrl}$1)`
    )
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const version = searchParams.get('version')
  const locale = searchParams.get('locale') ?? 'en'

  if (!version) {
    return NextResponse.json({ error: 'Missing required parameter: version' }, { status: 400 })
  }

  if (locale !== 'en' && locale !== 'zh') {
    return NextResponse.json({ error: 'Invalid locale. Must be "en" or "zh"' }, { status: 400 })
  }

  const filePath = join(process.cwd(), 'src', 'content', 'changelog', locale, 'page.mdx')

  try {
    const content = await readFile(filePath, 'utf-8')
    const entry = extractVersionEntry(content, version)

    if (!entry) {
      return NextResponse.json(
        { error: `Changelog entry not found for version ${version}` },
        { status: 404 }
      )
    }

    const markdown = mdxToMarkdown(entry)

    return NextResponse.json({ version, locale, content: markdown })
  } catch {
    return NextResponse.json({ error: 'Failed to read changelog file' }, { status: 500 })
  }
}
