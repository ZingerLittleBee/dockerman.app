import { defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { siteConfig } from '@/app/siteConfig'
import ChangelogPageContent from '@/components/changelog/ChangelogPageContent'
import { JsonLd } from '@/components/seo/JsonLd'
import { getChangelogEntries } from '@/lib/changelog'
import { SITE_URL } from '@/lib/seo'

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale
  const [{ t }, entries] = await Promise.all([getTranslation(locale), getChangelogEntries(locale)])

  const changelogUrl = `${SITE_URL}/${locale}/changelog`
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('changelog.title'),
    description: t('changelog.description'),
    url: changelogUrl,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: `${siteConfig.name} ${entry.version}`,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Windows, Linux',
        softwareVersion: entry.version,
        datePublished: entry.date,
        releaseNotes: entry.summary,
        url: `${changelogUrl}#${entry.id}`
      }
    }))
  }

  return (
    <>
      <JsonLd data={itemListLd} />
      <ChangelogPageContent
        copy={{
          badge: t('changelog.badge'),
          description: t('changelog.description'),
          title: t('changelog.title')
        }}
        entries={entries}
        locale={locale}
      />
    </>
  )
}
