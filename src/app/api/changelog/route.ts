/**
 * GET /api/changelog
 *
 * 获取指定版本的 Changelog，返回 Markdown 格式内容。
 *
 * Query Parameters:
 *   - version (required): 版本号，支持 "1.0.0" 或 "v1.0.0"
 *   - locale  (optional): 语言，可选值 "en" | "zh"，默认 "en"
 *
 * Response 200:
 *   { "version": "3.9.2", "locale": "zh", "content": "## Changelog markdown..." }
 *
 * Error Responses:
 *   400 - Missing required parameter: version
 *   400 - Invalid locale. Must be "en" or "zh"
 *   404 - Changelog entry not found for version x.x.x
 *   500 - Failed to read changelog file
 *
 * Examples:
 *   GET /api/changelog?version=3.9.2&locale=zh
 *   GET /api/changelog?version=1.0.0
 */
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
