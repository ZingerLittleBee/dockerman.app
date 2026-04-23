import { LenisProvider } from '@repo/shared/components/LenisProvider'
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
  const { locale } = await params
  return (
    <LenisProvider>
      <GridBackground />
      <Navbar locale={locale} />
      <div className="relative z-10">{children}</div>
      <Footer locale={locale} />
    </LenisProvider>
  )
}
