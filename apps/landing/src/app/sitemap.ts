import { defaultLocale, locales } from '@repo/shared/i18n'
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { source } from '@/lib/source'

const STATIC_ROUTES = [
  '',
  '/about',
  '/changelog',
  '/download',
  '/pricing',
  '/snapshot',
  '/privacy',
  '/terms',
  '/dpa'
]

function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`
  return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const route of STATIC_ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.7,
        alternates: { languages: buildLanguageAlternates(route) }
      })
    }
  }

  for (const locale of locales) {
    const pages = source.getPages(locale)
    for (const page of pages) {
      const slugPath = page.slugs.length > 0 ? `/${page.slugs.join('/')}` : ''
      const path = `/docs${slugPath}`
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: buildLanguageAlternates(path) }
      })
    }
  }

  return entries
}
