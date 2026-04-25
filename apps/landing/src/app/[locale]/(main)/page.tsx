import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { Hero } from '@/components/landing/Hero'
import { LiveDashboard } from '@/components/landing/LiveDashboard'
import { ModulesSection } from '@/components/landing/ModulesSection'
import { RuntimeStrip } from '@/components/landing/RuntimeStrip'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  return {
    title: t('meta.home.title'),
    description: t('meta.home.description')
  }
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return (
    <main>
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
