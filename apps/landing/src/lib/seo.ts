import { defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { siteConfig } from '@/app/siteConfig'

export function buildAlternates(locale: Locale, pathWithoutLocale = '') {
  const path = pathWithoutLocale.startsWith('/') || pathWithoutLocale === ''
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`

  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${siteConfig.url}/${l}${path}`
  }
  languages['x-default'] = `${siteConfig.url}/${defaultLocale}${path}`

  return {
    canonical: `${siteConfig.url}/${locale}${path}`,
    languages
  }
}
