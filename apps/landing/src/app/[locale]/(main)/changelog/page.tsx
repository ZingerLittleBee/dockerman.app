import { defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import ChangelogSubscribeForm from '@/components/changelog/ChangelogSubscribeForm'
import ChangelogTimeline from '@/components/changelog/ChangelogTimeline'
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
    <div className="flex flex-col">
      <section
        aria-labelledby="changelog-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <div>
          <Badge>{t('changelog.badge')}</Badge>
        </div>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="changelog-overview"
        >
          <Balancer>{t('changelog.title')}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {t('changelog.description')}
        </p>
      </section>

      <section className="my-16">
        <ChangelogTimeline entries={entries} locale={locale} />
      </section>

      <ChangelogSubscribeForm copy={subscribeCopy} />
    </div>
  )
}
