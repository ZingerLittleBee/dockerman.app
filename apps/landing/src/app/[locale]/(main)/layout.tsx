import { LenisProvider } from '@repo/shared/components/LenisProvider'
import type { Locale } from '@repo/shared/i18n'
import type { ReactNode } from 'react'
import { Footer } from '@/components/shell/Footer'
import { GridBackground } from '@/components/shell/GridBackground'
import { Navbar } from '@/components/shell/Navbar'

export default async function MainLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale
  return (
    <LenisProvider>
      <GridBackground />
      <div className="relative z-10">
        <Navbar locale={locale} />
        {children}
        <Footer locale={locale} />
      </div>
    </LenisProvider>
  )
}
