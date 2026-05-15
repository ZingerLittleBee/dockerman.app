import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { siteConfig } from '@/app/siteConfig'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { Hero } from '@/components/landing/Hero'
import { LiveDashboard } from '@/components/landing/LiveDashboard'
import { ModulesSection } from '@/components/landing/ModulesSection'
import { RuntimeStrip } from '@/components/landing/RuntimeStrip'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildAlternates } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  const title = t('meta.home.title')
  const description = t('meta.home.description')
  return {
    title,
    description,
    alternates: buildAlternates(locale as Locale),
    openGraph: { title, description, url: `${siteConfig.url}/${locale}` },
    twitter: { title, description }
  }
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const description = t('meta.home.description')

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/opengraph-image.png`,
    sameAs: ['https://github.com/ZingerLittleBee', 'https://twitter.com/zinger_bee']
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: `${siteConfig.url}/${l}`,
    description,
    inLanguage: l,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/${l}/docs?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Windows, Linux',
    softwareVersion: siteConfig.latestVersion,
    url: `${siteConfig.url}/${l}`,
    downloadUrl: `${siteConfig.url}/${l}/download`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'ZingerBee', url: 'https://github.com/ZingerLittleBee' }
  }

  return (
    <main>
      <JsonLd data={[organizationLd, websiteLd, softwareLd]} />
      <Hero locale={l} />
      <div className="relative hidden px-5 md:block md:px-8">
        <LiveDashboard locale={l} />
      </div>
      <RuntimeStrip locale={l} />
      <FeaturesGrid locale={l} />
      <ModulesSection locale={l} />
      <CtaFinal locale={l} />
    </main>
  )
}
