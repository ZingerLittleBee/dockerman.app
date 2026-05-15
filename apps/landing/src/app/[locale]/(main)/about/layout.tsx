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
  const title = 'About Dockerman'
  const description =
    'The story and philosophy behind Dockerman — a local-first desktop UI for Docker, Podman, and Kubernetes, built in Rust and Tauri.'
  return {
    title,
    description,
    alternates: buildAlternates(locale as Locale, '/about'),
    openGraph: { title, description, url: `${siteConfig.url}/${locale}/about` }
  }
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="mx-auto mt-36 max-w-6xl">{children}</main>
}
