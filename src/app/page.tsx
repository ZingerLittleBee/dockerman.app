import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { cookieName, defaultLocale, locales, type Locale } from '@/lib/i18n'

export default async function RootPage() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const cookieLocale = cookieStore.get(cookieName)?.value as Locale | undefined

  if (cookieLocale && locales.includes(cookieLocale)) {
    redirect(`/${cookieLocale}`)
  }

  const acceptLanguage = headerStore.get('accept-language') || ''
  const locale = acceptLanguage.toLowerCase().includes('zh') ? 'zh' : defaultLocale

  redirect(`/${locale}`)
}
