import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { siteConfig } from '@/app/siteConfig'
import { CompareFaq } from '@/components/compare/CompareFaq'
import { CompareHero } from '@/components/compare/CompareHero'
import { CompareTable } from '@/components/compare/CompareTable'
import { CompareTopics } from '@/components/compare/CompareTopics'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { JsonLd } from '@/components/seo/JsonLd'
import { compareVars } from '@/config/compare'
import { buildAlternates, SITE_URL } from '@/lib/seo'

export const dynamic = 'error'

const COMPARE_PATH = '/vs-docker-desktop'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  const title = t('meta.compare.title')
  const description = t('meta.compare.description')
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale as Locale, COMPARE_PATH),
    openGraph: { title, description, url: `${siteConfig.url}/${locale}${COMPARE_PATH}` },
    twitter: { title, description }
  }
}

export default async function VsDockerDesktopPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const title = t('meta.compare.title')
  const description = t('meta.compare.description')
  const pageUrl = `${SITE_URL}/${l}${COMPARE_PATH}`
  const vars = compareVars()
  const faqItems = asFaqItems(t('compare.faq.items', { returnObjects: true }))

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: pageUrl,
    inLanguage: l,
    isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: `${SITE_URL}/${l}` }
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: siteConfig.name,
        item: `${SITE_URL}/${l}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: pageUrl
      }
    ]
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  }

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Windows, Linux',
    softwareVersion: siteConfig.latestVersion,
    url: pageUrl,
    downloadUrl: `${SITE_URL}/${l}/download`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'ZingerBee', url: 'https://github.com/ZingerLittleBee' }
  }

  return (
    <main>
      <JsonLd data={[webPageLd, breadcrumbLd, faqLd, softwareLd]} />
      <CompareHero locale={l} />
      <CompareTable locale={l} vars={vars} />
      <CompareTopics locale={l} vars={vars} />
      <CompareFaq locale={l} />
      <CtaFinal locale={l} />
    </main>
  )
}

function asFaqItems(value: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter(
    (item): item is { question: string; answer: string } =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as { question?: unknown }).question === 'string' &&
      typeof (item as { answer?: unknown }).answer === 'string'
  )
}
