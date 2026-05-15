import { defaultLocale } from '@repo/shared/i18n'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AgentationClient from '@/components/AgentationClient'
import { LangScript } from '@/components/shell/LangScript'
import { ThemeScript } from '@/components/shell/ThemeScript'
import { siteConfig } from './siteConfig'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s — Dockerman'
  },
  description: siteConfig.description,
  keywords: [
    'Docker GUI',
    'Docker Desktop alternative',
    'Docker management',
    'Kubernetes UI',
    'Kubernetes GUI',
    'Podman desktop',
    'container manager',
    'docker compose UI',
    'remote docker host',
    'docker over SSH',
    'WSL2 docker',
    'k3d GUI',
    'Helm GUI',
    'Trivy scan UI',
    'homelab docker manager',
    'Tauri',
    'Rust desktop app'
  ],
  authors: [
    {
      name: 'ZingerBee',
      url: 'https://github.com/ZingerLittleBee'
    }
  ],
  creator: 'ZingerBee',
  applicationName: siteConfig.name,
  category: 'developer tools',
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Dockerman — local-first Docker, Podman & Kubernetes UI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    site: '@zinger_bee',
    creator: '@zinger_bee',
    images: ['/opengraph-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <LangScript />
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-grab/dist/index.global.js"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body
        className={`${inter.variable} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
      >
        {children}
        {process.env.NODE_ENV === 'development' ? <AgentationClient /> : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
