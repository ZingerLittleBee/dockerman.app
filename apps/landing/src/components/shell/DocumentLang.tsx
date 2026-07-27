'use client'

import type { Locale } from '@repo/shared/i18n'
import { useEffect } from 'react'

export function DocumentLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
