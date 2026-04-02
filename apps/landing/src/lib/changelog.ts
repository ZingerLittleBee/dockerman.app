import 'server-only'

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Locale } from '@repo/shared/i18n'
import { cache } from 'react'

export type ChangelogSectionTone =
  | 'feature'
  | 'improvement'
  | 'bugfix'
  | 'performance'
  | 'localization'
  | 'other'

export interface ChangelogItem {
  content: string
  icon?: string
  label?: string
  description?: string
}

export interface ChangelogSection {
  id: string
  items: ChangelogItem[]
  title: string
  tone: ChangelogSectionTone
}

export interface ChangelogImageAsset {
  alt: string
  src: string
}

export interface ChangelogEntryData {
  date: string
  id: string
  images: ChangelogImageAsset[]
  sections: ChangelogSection[]
  summary: string
  title: string
  version: string
}

const entryPattern =
  /<ChangelogEntry\s+version="([^"]+)"\s+date="([^"]+)"[^>]*>([\s\S]*?)<\/ChangelogEntry>/g
const imagePattern = /<ChangelogImage\s+src="([^"]+)"\s+alt="([^"]+)"\s*\/>/g
const leadingColonPattern = /^[:：]\s*/
const richItemPattern = /^(.*?)<Bold>(.*?)<\/Bold>\s*(.*)$/
const slugBoundaryPattern = /^-+|-+$/g
const slugSeparatorPattern = /[^\p{Letter}\p{Number}]+/gu
const trailingColonPattern = /[:：]\s*$/

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function stripTags(value: string) {
  return value.replace(/<\/?Bold>/g, '')
}

function normalizeInlineText(value: string) {
  return normalizeWhitespace(stripTags(value))
}

function stripTrailingColon(value: string) {
  return value.replace(trailingColonPattern, '').trim()
}

function createId(value: string) {
  return value.toLowerCase().replace(slugSeparatorPattern, '-').replace(slugBoundaryPattern, '')
}

function getSectionTone(title: string): ChangelogSectionTone {
  const normalizedTitle = title.toLowerCase()

  if (normalizedTitle.includes('feature') || title.includes('新功能')) {
    return 'feature'
  }

  if (normalizedTitle.includes('improvement') || title.includes('改进')) {
    return 'improvement'
  }

  if (normalizedTitle.includes('bug') || title.includes('修复')) {
    return 'bugfix'
  }

  if (normalizedTitle.includes('performance') || title.includes('性能')) {
    return 'performance'
  }

  if (
    normalizedTitle.includes('international') ||
    normalizedTitle.includes('i18n') ||
    title.includes('国际化')
  ) {
    return 'localization'
  }

  return 'other'
}

function parseItem(rawItem: string): ChangelogItem {
  const content = normalizeWhitespace(rawItem)
  const richMatch = content.match(richItemPattern)

  if (!richMatch) {
    return {
      content: normalizeInlineText(content)
    }
  }

  const [, rawIcon, rawLabel, rawDescription] = richMatch
  const icon = normalizeWhitespace(rawIcon) || undefined
  const label = stripTrailingColon(normalizeInlineText(rawLabel)) || undefined
  const description =
    normalizeInlineText(rawDescription).replace(leadingColonPattern, '') || undefined

  return {
    content: normalizeInlineText(content),
    description,
    icon,
    label
  }
}

function parseEntry(version: string, date: string, body: string): ChangelogEntryData {
  const images = Array.from(body.matchAll(imagePattern), ([, src, alt]) => ({ alt, src }))
  const lines = body.split('\n').filter((line) => !line.includes('<ChangelogImage'))

  let title = ''
  const summaryLines: string[] = []
  const sections: ChangelogSection[] = []

  let activeSectionTitle: string | null = null
  let activeItems: string[] = []
  let activeItemLines: string[] = []

  const flushItem = () => {
    if (activeItemLines.length === 0) {
      return
    }

    activeItems.push(activeItemLines.join(' '))
    activeItemLines = []
  }

  const flushSection = () => {
    if (!activeSectionTitle) {
      return
    }

    sections.push({
      id: `${createId(version)}-${createId(activeSectionTitle)}`,
      items: activeItems.map(parseItem),
      title: activeSectionTitle,
      tone: getSectionTone(activeSectionTitle)
    })

    activeItems = []
    activeSectionTitle = null
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      continue
    }

    if (trimmedLine.startsWith('## ')) {
      title = normalizeInlineText(trimmedLine.slice(3))
      continue
    }

    if (trimmedLine.startsWith('### ')) {
      flushItem()
      flushSection()
      activeSectionTitle = normalizeInlineText(trimmedLine.slice(4))
      continue
    }

    if (trimmedLine.startsWith('- ')) {
      flushItem()
      activeItemLines = [trimmedLine.slice(2).trim()]
      continue
    }

    if (activeItemLines.length > 0) {
      activeItemLines.push(trimmedLine)
      continue
    }

    if (!activeSectionTitle) {
      summaryLines.push(trimmedLine)
    }
  }

  flushItem()
  flushSection()

  return {
    date,
    id: `release-${createId(version)}`,
    images,
    sections,
    summary: normalizeInlineText(summaryLines.join(' ')),
    title,
    version
  }
}

export const getChangelogEntries = cache(async (locale: Locale) => {
  const filePath = join(process.cwd(), 'src', 'content', 'changelog', locale, 'page.mdx')
  const source = await readFile(filePath, 'utf-8')

  return Array.from(source.matchAll(entryPattern), ([, version, date, body]) =>
    parseEntry(version, date, body)
  )
})
