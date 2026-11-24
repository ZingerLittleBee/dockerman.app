import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { siteConfig } from '@/app/siteConfig'
import { CommandPalette } from '@/components/home/CommandPalette'
import { list, paletteLabels } from '@/components/home/copy'
import { DetailsSection } from '@/components/home/DetailsSection'
import { shotsFor } from '@/components/home/data'
import { EngineMarquee, EnginesSection, StatsStrip } from '@/components/home/EnginesSection'
import { FinalCta } from '@/components/home/FinalCta'
import { FleetSection } from '@/components/home/FleetSection'
import { HomeHero } from '@/components/home/HomeHero'
import s from '@/components/home/home.module.css'
import { cn, SectionTitle } from '@/components/home/primitives'
import { ReleasesSection } from '@/components/home/ReleasesSection'
import { SandboxSection } from '@/components/home/SandboxSection'
import { Showcase } from '@/components/home/Showcase'
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

interface ShowcaseCopy {
  name: string
  description: string
  chip: string
  alt: string
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const description = t('meta.home.description')
  const shots = shotsFor(l)

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

  const showcaseImages = [shots.stats, shots.kubernetes, shots.logs, shots.images]
  const showcaseTabs = list<ShowcaseCopy>(t, 'home.showcase.tabs').map((tab, i) => ({
    ...tab,
    image: showcaseImages[i]
  }))

  return (
    <main className={cn(s.pg, (l === 'zh' || l === 'ja') && s.cjk, s[l])}>
      <JsonLd data={[ORGANIZATION_LD, websiteLd, softwareLd]} />
      <HomeHero locale={l} t={t} />
      <EngineMarquee t={t} />
      <EnginesSection t={t} />
      <StatsStrip t={t} />
      <Showcase
        heading={
          <SectionTitle lead={t('home.showcase.titleLead')} trail={t('home.showcase.titleTrail')} />
        }
        tabs={showcaseTabs}
      />
      <CommandPalette
        background={shots.palette}
        heading={
          <SectionTitle
            centered
            lead={t('home.palette.titleLead')}
            trail={t('home.palette.titleTrail')}
          />
        }
        labels={paletteLabels(t)}
      />
      <FleetSection t={t} />
      <SandboxSection t={t} />
      <DetailsSection t={t} />
      <ReleasesSection locale={l} t={t} />
      <FinalCta locale={l} t={t} />
    </main>
  )
}
