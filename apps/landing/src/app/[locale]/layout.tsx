import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { Geist_Mono, Instrument_Serif, Inter } from 'next/font/google'
import { siteConfig } from '@/app/siteConfig'
import { ThemeScript } from '@/components/shell/ThemeScript'
import { provider } from '@/lib/i18n/fumadocs-ui'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800']
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
  style: ['italic', 'normal']
})

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  const titles: Record<Locale, string> = {
    en: 'Dockerman - Modern Docker Management UI',
    zh: 'Dockerman - 现代化 Docker 管理界面',
    ja: 'Dockerman - モダンな Docker 管理 UI',
    es: 'Dockerman - UI Moderna de Gestión Docker'
  }

  const descriptions: Record<Locale, string> = {
    en: siteConfig.description,
    zh: '基于 Tauri 和 Rust 构建的现代轻量级 Docker 管理界面，专注于简洁和性能。',
    ja: 'Tauri と Rust で構築されたモダンで軽量な Docker 管理インターフェース。シンプルさとパフォーマンスに焦点を当てています。',
    es: 'UI moderna y ligera de gestión Docker construida con Tauri y Rust, enfocada en simplicidad y rendimiento.'
  }

  const localeMap: Record<Locale, string> = {
    en: 'en_US',
    zh: 'zh_CN',
    ja: 'ja_JP',
    es: 'es_ES'
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      locale: localeMap[locale]
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  return (
    <RootProvider i18n={provider(locale)}>
      <I18nProvider locale={locale}>
        <ThemeScript />
        <div
          className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable} contents`}
        >
          <AnalyticsTracker />
          {children}
        </div>
      </I18nProvider>
    </RootProvider>
  )
}
