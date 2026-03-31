import type { Metadata } from 'next'
import type { Locale } from '@repo/shared/i18n'

const meta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Pricing',
    description:
      'Simple pricing for Dockerman. Free for local Docker management. One-time payment for remote SSH access and multi-host support.'
  },
  zh: {
    title: '定价',
    description:
      'Dockerman 简单定价。本地 Docker 管理免费。一次付费即可获得远程 SSH 访问和多主机管理支持。'
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
  return <>{children}</>
}
