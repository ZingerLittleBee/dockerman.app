'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { type Locale, getOptions, locales } from './settings'

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

export function useTranslation(lng: Locale) {
  const ret = useTranslationOrg()
  const { i18n } = ret

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  }

  return ret
}
