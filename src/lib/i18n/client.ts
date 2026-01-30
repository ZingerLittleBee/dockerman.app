'use client'

import i18next from 'i18next'
import { usePathname } from 'next/navigation'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useEffect } from 'react'
import { type Locale, getOptions, locales, defaultLocale } from './settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string) => import(`@/locales/${language}.json`)
    )
  )
  .init({
    ...getOptions(),
    preload: runsOnServerSide ? locales : [],
  })

export function useLocale(): Locale {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale
  }
  return defaultLocale
}

export function useTranslation(lng?: Locale) {
  const pathLocale = useLocale()
  const locale = lng ?? pathLocale
  const ret = useTranslationOrg()
  const { i18n } = ret

  // Change language synchronously on server side
  if (runsOnServerSide && locale && i18n.resolvedLanguage !== locale) {
    i18n.changeLanguage(locale)
  }

  // Change language on client side after mount
  useEffect(() => {
    if (locale && i18n.resolvedLanguage !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  // Return t function that uses correct locale for SSR
  const fixedT = i18n.getFixedT(locale)
  return {
    ...ret,
    t: fixedT
  }
}
