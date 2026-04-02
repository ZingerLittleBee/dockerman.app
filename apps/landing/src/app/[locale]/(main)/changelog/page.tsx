import { defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import ChangelogPageContent from '@/components/changelog/ChangelogPageContent'
import { getChangelogEntries } from '@/lib/changelog'

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale
  const [{ t }, entries] = await Promise.all([getTranslation(locale), getChangelogEntries(locale)])
  const subscribeCopy = {
    button: t('changelog.subscribe.button'),
    description: t('changelog.subscribe.description'),
    error: t('changelog.subscribe.error'),
    fallbackSuccess: t('changelog.subscribe.fallbackSuccess'),
    notice: t('changelog.subscribe.notice'),
    placeholder: t('changelog.subscribe.placeholder'),
    success: t('changelog.subscribe.success'),
    title: t('changelog.subscribe.title')
  }

  return (
    <ChangelogPageContent
      copy={{
        badge: t('changelog.badge'),
        description: t('changelog.description'),
        subscribe: subscribeCopy,
        title: t('changelog.title')
      }}
      entries={entries}
      locale={locale}
    />
  )
}
