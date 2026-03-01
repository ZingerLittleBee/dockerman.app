'use client'

import i18next from 'i18next'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
// Import translations synchronously to avoid hydration mismatch
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { defaultLocale, getOptions, type Locale, locales } from './settings'

const resources = {
  en: { translation: en },
  zh: { translation: zh }
}

i18next.use(initReactI18next).init({
  ...getOptions(),
  resources
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

  // Change language on client side after mount
  useEffect(() => {
    if (locale && i18n.resolvedLanguage !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  // Return t function that uses correct locale for SSR
  // Resources are loaded synchronously, so getFixedT works immediately
  const fixedT = i18n.getFixedT(locale)
  return {
    ...ret,
    t: fixedT
  }
}
