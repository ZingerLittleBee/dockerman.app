import type { MetadataRoute } from 'next'

const BASE_URL = 'https://dockerman.app'

const locales = ['en', 'zh'] as const

/** Main (non-docs) pages under /{locale}/... */
const pages = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
  { path: '/download', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/changelog', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/docs', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/dpa', changeFrequency: 'yearly' as const, priority: 0.2 }
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}${page.path}`

      const alternates: Record<string, string> = {}
      for (const alt of locales) {
        alternates[alt] = `${BASE_URL}/${alt}${page.path}`
      }

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: alternates }
      })
    }
  }

  return entries
}
