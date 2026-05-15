import type { Locale } from '@repo/shared/i18n'
import type { Metadata } from 'next'
import { siteConfig } from '@/app/siteConfig'
import { buildAlternates } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const title = 'Changelog — Dockerman releases'
  const description =
    'Release notes for Dockerman, the local-first Docker, Podman, and Kubernetes desktop UI. Track new features, fixes, and platform support.'
  return {
    title,
    description,
    alternates: buildAlternates(locale as Locale, '/changelog'),
    openGraph: { title, description, url: `${siteConfig.url}/${locale}/changelog` }
  }
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="w-full">{children}</main>
}
