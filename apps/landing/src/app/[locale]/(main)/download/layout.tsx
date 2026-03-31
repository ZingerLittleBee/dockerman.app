import type { Metadata } from 'next'
import type { Locale } from '@repo/shared/i18n'

const meta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Download',
    description:
      'Download Dockerman for macOS, Windows, or Linux. A lightweight Docker management UI built with Tauri and Rust.'
  },
  zh: {
    title: '下载',
    description: '下载适用于 macOS、Windows 或 Linux 的 Dockerman。基于 Tauri 和 Rust 构建的轻量级 Docker 管理界面。'
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
