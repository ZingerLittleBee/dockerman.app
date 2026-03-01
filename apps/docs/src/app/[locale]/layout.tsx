import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ReactNode } from 'react'
import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'
import { provider } from '@/lib/i18n/fumadocs-ui'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  const titles: Record<Locale, string> = {
    en: 'Dockerman Docs',
    zh: 'Dockerman 文档'
  }

  return {
    title: titles[locale]
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  return (
    <RootProvider i18n={provider(locale)}>
      <I18nProvider locale={locale}>
        <AnalyticsTracker />
        <DocsLayout tree={source.getPageTree(locale)} {...baseOptions(locale)} i18n>
          {children}
        </DocsLayout>
      </I18nProvider>
    </RootProvider>
  )
}
