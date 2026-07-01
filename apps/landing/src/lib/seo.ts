import { defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { siteConfig } from '@/app/siteConfig'

// Single normalized origin (no trailing slash) so canonical/hreflang/sitemap
// URLs never produce `//en/path` if siteConfig.url is edited to end with `/`.
export const SITE_URL = siteConfig.url.replace(/\/+$/, '')

export function buildAlternates(locale: Locale, pathWithoutLocale = '') {
  const path =
    pathWithoutLocale.startsWith('/') || pathWithoutLocale === ''
      ? pathWithoutLocale
      : `/${pathWithoutLocale}`

  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages
  }
}
