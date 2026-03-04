import type { Metadata } from 'next'
import type { Locale } from '@repo/shared/i18n'

const meta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'About',
    description:
      'Meet the team behind Dockerman, our mission, and the values that drive us to build the best Docker management tool.'
  },
  zh: {
    title: '关于',
    description: '了解 Dockerman 团队、我们的使命以及驱动我们打造最佳 Docker 管理工具的价值观。'
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
