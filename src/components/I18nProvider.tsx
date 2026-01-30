'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { type Locale } from '@/lib/i18n'
import '@/lib/i18n/client'

interface I18nProviderProps {
  children: React.ReactNode
  locale: Locale
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  useEffect(() => {
    if (i18next.resolvedLanguage !== locale) {
      i18next.changeLanguage(locale)
    }
  }, [locale])

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}
