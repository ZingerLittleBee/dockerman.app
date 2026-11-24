import { LenisProvider } from '@repo/shared/components/LenisProvider'
import type { Locale } from '@repo/shared/i18n'
import { Geist } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/shell/Footer'
import { Navbar } from '@/components/shell/Navbar'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap'
})

/**
 * The home page is designed dark-only. The `dark` class scopes the dark token set to this
 * subtree, so the page stays dark even when the visitor picked the light theme elsewhere.
 */
export default async function HomeLayout({
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
      <div
        className={`dark dm-home ${geist.variable} min-h-screen bg-dm-bg text-dm-ink [color-scheme:dark]`}
      >
        <Navbar locale={locale} themeSwitch={false} />
        <div className="outline-none" id="main" tabIndex={-1}>
          {children}
        </div>
        <Footer locale={locale} />
      </div>
    </LenisProvider>
  )
}
