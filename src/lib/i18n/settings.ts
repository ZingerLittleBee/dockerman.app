export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const cookieName = 'NEXT_LOCALE'

export function getOptions(lng: Locale = defaultLocale) {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
  }
}
