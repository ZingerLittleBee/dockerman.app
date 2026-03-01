import { ThemeProvider } from 'next-themes'
import { siteConfig } from '@/app/siteConfig'
import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  const titles: Record<Locale, string> = {
    en: 'Dockerman - Modern Docker Management UI',
    zh: 'Dockerman - 现代化 Docker 管理界面'
  }

  const descriptions: Record<Locale, string> = {
    en: siteConfig.description,
    zh: '基于 Tauri 和 Rust 构建的现代轻量级 Docker 管理界面，专注于简洁和性能。'
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      locale: locale === 'zh' ? 'zh_CN' : 'en_US'
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nProvider locale={locale}>
        <AnalyticsTracker />
        {children}
      </I18nProvider>
    </ThemeProvider>
  )
}
