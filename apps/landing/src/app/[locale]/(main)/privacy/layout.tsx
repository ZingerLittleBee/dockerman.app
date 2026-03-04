import type { Metadata } from 'next'
import type { Locale } from '@repo/shared/i18n'

const meta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Privacy Policy',
    description:
      'Learn how Dockerman handles your data. All container data is processed locally; we collect only minimal anonymous analytics.'
  },
  zh: {
    title: '隐私政策',
    description: '了解 Dockerman 如何处理您的数据。所有容器数据均在本地处理，我们仅收集最少量的匿名分析数据。'
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = meta[(locale as Locale) ?? 'en']
  return { title: m.title, description: m.description }
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="mx-auto mt-36 max-w-6xl">{children}</main>
}
