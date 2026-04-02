export const locales = ['en', 'zh', 'ja', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const cookieName = 'NEXT_LOCALE'

export const localeConfig: Record<Locale, { flag: string; name: string }> = {
  en: { flag: '🇺🇸', name: 'English' },
  zh: { flag: '🇨🇳', name: '中文' },
  ja: { flag: '🇯🇵', name: '日本語' },
  es: { flag: '🇪🇸', name: 'Español' },
}

export function getOptions(lng: Locale = defaultLocale) {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng
  }
}
