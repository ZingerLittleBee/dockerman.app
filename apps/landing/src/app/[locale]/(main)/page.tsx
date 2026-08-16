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
import { buildAlternates, SITE_URL } from '@/lib/seo'

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image.png`,
  sameAs: ['https://github.com/ZingerLittleBee', 'https://twitter.com/zinger_bee']
}

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
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale as Locale),
    openGraph: { title, description, url: `${SITE_URL}/${locale}` },
    twitter: { title, description }
  }
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const description = t('meta.home.description')

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: `${SITE_URL}/${l}`,
    description,
    inLanguage: l,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/${l}/docs?q={search_term_string}`,
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
    url: `${SITE_URL}/${l}`,
    downloadUrl: `${SITE_URL}/${l}/download`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'ZingerBee', url: 'https://github.com/ZingerLittleBee' }
  }

  return (
    <main>
      <JsonLd data={[ORGANIZATION_LD, websiteLd, softwareLd]} />
      <Hero locale={l} />
      <div className="relative px-5 md:px-8">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 md:hidden"
          style={{
            background: 'linear-gradient(to left, var(--color-dm-bg), transparent)'
          }}
        />
        <div className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[880px] md:min-w-0">
            <LiveDashboard locale={l} />
          </div>
        </div>
      </div>
      <RuntimeStrip locale={l} />
      <FeaturesGrid locale={l} />
      <ModulesSection locale={l} />
      <CtaFinal locale={l} />
    </main>
  )
}
