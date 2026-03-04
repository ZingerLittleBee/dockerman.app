import type { Metadata } from 'next'
import type { Locale } from '@repo/shared/i18n'

const meta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Data Processing Agreement',
    description:
      'Dockerman Data Processing Agreement outlining how your data is processed and protected.'
  },
  zh: {
    title: '数据处理协议',
    description: 'Dockerman 数据处理协议，概述您的数据如何被处理和保护。'
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
