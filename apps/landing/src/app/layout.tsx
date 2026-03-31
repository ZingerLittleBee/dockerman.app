import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { LenisProvider } from '@repo/shared/components/LenisProvider'
import { JsonLd } from '@/components/JsonLd'
import { siteConfig } from './siteConfig'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://dockerman.app'),
  title: {
    default: 'Dockerman - Modern Docker Management UI',
    template: '%s | Dockerman'
  },
  description: siteConfig.description,
  keywords: [
    'Docker',
    'UI',
    'Management',
    'Tauri',
    'Rust',
    'Desktop',
    'App',
    'Container',
    'Image',
    'Monitoring',
    'Terminal',
    'Dashboard',
    'Cross-platform',
    'Resource Usage',
    'Logs',
    'Process',
    'Statistics',
    'Docker Management',
    'Container Management',
    'DevOps'
  ],
  authors: [
    {
      name: 'ZingerBee',
      url: 'https://github.com/ZingerLittleBee'
    }
  ],
  creator: 'ZingerBee',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Dockerman - Modern Docker Management UI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@zinger_bee',
    images: ['/opengraph-image.png']
  },
  icons: {
    icon: '/favicon.ico'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org' as const,
  '@type': 'Organization' as const,
  name: 'Dockerman',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.svg`,
  sameAs: [
    'https://github.com/ZingerLittleBee',
    'https://twitter.com/zinger_bee'
  ]
}

const websiteJsonLd = {
  '@context': 'https://schema.org' as const,
  '@type': 'WebSite' as const,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { '@type': 'Organization' as const, name: 'Dockerman' }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-grab/dist/index.global.js"
            strategy="beforeInteractive"
          />
        )}
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body
        className={`${inter.variable} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
      >
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
