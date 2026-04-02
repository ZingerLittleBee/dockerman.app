import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'

export default async function RootPage() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const cookieLocale = cookieStore.get(cookieName)?.value as Locale | undefined

  if (cookieLocale && locales.includes(cookieLocale)) {
    redirect(`/${cookieLocale}`)
  }

  const acceptLanguage = headerStore.get('accept-language') || ''
  const lang = acceptLanguage.toLowerCase()
  let locale: Locale = defaultLocale
  if (lang.includes('zh')) locale = 'zh'
  else if (lang.includes('ja')) locale = 'ja'
  else if (lang.includes('es')) locale = 'es'

  redirect(`/${locale}`)
}
