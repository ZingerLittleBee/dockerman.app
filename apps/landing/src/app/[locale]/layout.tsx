import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { Geist_Mono, Instrument_Serif } from 'next/font/google'
import { siteConfig } from '@/app/siteConfig'
import { DocumentLang } from '@/components/shell/DocumentLang'
import { provider } from '@/lib/i18n/fumadocs-ui'
import { buildAlternates } from '@/lib/seo'

// Geist_Mono is only used in code blocks and small UI labels (not above-the-fold
// critical), so skip preload to free up the initial network budget for Inter +
// Instrument_Serif (both used in the Hero H1).
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
})

// Every usage is `<Accent>` italic in headlines — drop the normal style file.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
  style: 'italic',
  fallback: ['ui-serif', 'Georgia', 'serif']
})

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
  es: 'es_ES'
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  const titles: Record<Locale, string> = {
    en: 'Dockerman - Lightweight Docker Desktop Alternative',
    zh: 'Dockerman - 不用 Docker Desktop 的轻量 Docker UI',
    ja: 'Dockerman - 軽量な Docker Desktop 代替 UI',
    es: 'Dockerman - Alternativa ligera a Docker Desktop'
  }

  const descriptions: Record<Locale, string> = {
    en: siteConfig.description,
    zh: '不用 Docker Desktop 的轻量 Docker UI。基于 Tauri 和 Rust 的本地优先桌面客户端，管理 Docker、Podman 与 Kubernetes。本地使用永久免费。',
    ja: 'Docker Desktop の軽量な代替 UI。Tauri と Rust で構築されたローカルファーストのデスクトップ。Docker、Podman、Kubernetes を管理。ローカル利用は永久無料。',
    es: 'Alternativa ligera a Docker Desktop. UI local-first construida con Tauri y Rust para Docker, Podman y Kubernetes. El uso local es gratis para siempre.'
  }

  const alternateLocales: string[] = []
  for (const candidate of locales) {
    if (candidate !== locale) {
      alternateLocales.push(OPEN_GRAPH_LOCALES[candidate])
    }
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: buildAlternates(locale),
    openGraph: {
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: alternateLocales,
      url: `${siteConfig.url}/${locale}`
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
    <RootProvider
      i18n={provider(locale)}
      theme={{ defaultTheme: 'dark', enableSystem: false, attribute: 'class' }}
    >
      <I18nProvider>
        <DocumentLang locale={locale} />
        <div className={`${geistMono.variable} ${instrumentSerif.variable} contents`}>
          <AnalyticsTracker />
          {children}
        </div>
      </I18nProvider>
    </RootProvider>
  )
}
