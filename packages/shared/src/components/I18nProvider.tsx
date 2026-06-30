'use client'

import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import '../i18n/client'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}
