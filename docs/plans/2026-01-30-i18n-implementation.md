# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add multi-language support (English default, Chinese optional) to the Dockerman website.

**Architecture:** Path-based routing (`/en`, `/zh`) with middleware-based language detection, react-i18next for translations, and Cookie storage for user preferences.

**Tech Stack:** Next.js 16 App Router, react-i18next, TypeScript, pnpm

---

## Task 1: Install i18n Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

Run:
```bash
pnpm add i18next react-i18next i18next-resources-to-backend
```

Expected: Packages added to dependencies

**Step 2: Verify installation**

Run:
```bash
pnpm list i18next react-i18next i18next-resources-to-backend
```

Expected: All three packages listed

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add i18n dependencies"
```

---

## Task 2: Create i18n Configuration

**Files:**
- Create: `src/lib/i18n/settings.ts`
- Create: `src/lib/i18n/index.ts`
- Create: `src/lib/i18n/client.ts`
- Create: `src/lib/i18n/server.ts`

**Step 1: Create settings file**

Create `src/lib/i18n/settings.ts`:

```typescript
export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const cookieName = 'NEXT_LOCALE'

export function getOptions(lng: Locale = defaultLocale) {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
  }
}
```

**Step 2: Create index file**

Create `src/lib/i18n/index.ts`:

```typescript
export { locales, defaultLocale, cookieName, getOptions } from './settings'
export type { Locale } from './settings'
```

**Step 3: Create client-side i18n**

Create `src/lib/i18n/client.ts`:

```typescript
'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { type Locale, getOptions, locales } from './settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string) => import(`@/locales/${language}.json`)
    )
  )
  .init({
    ...getOptions(),
    preload: runsOnServerSide ? locales : [],
  })

export function useTranslation(lng: Locale) {
  const ret = useTranslationOrg()
  const { i18n } = ret

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  }

  return ret
}
```

**Step 4: Create server-side i18n**

Create `src/lib/i18n/server.ts`:

```typescript
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { type Locale, getOptions } from './settings'

const initI18next = async (lng: Locale) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string) => import(`@/locales/${language}.json`)
      )
    )
    .init(getOptions(lng))
  return i18nInstance
}

export async function getTranslation(lng: Locale) {
  const i18nextInstance = await initI18next(lng)
  return {
    t: i18nextInstance.getFixedT(lng),
    i18n: i18nextInstance,
  }
}
```

**Step 5: Commit**

```bash
git add src/lib/i18n/
git commit -m "feat: add i18n configuration"
```

---

## Task 3: Create Translation Files

**Files:**
- Create: `src/locales/en.json`
- Create: `src/locales/zh.json`

**Step 1: Create English translation file**

Create `src/locales/en.json`:

```json
{
  "nav": {
    "home": "Home",
    "download": "Download",
    "changelog": "Changelog"
  },
  "hero": {
    "title": "Modern Docker",
    "titleBreak": "management simplified",
    "description": "A lightweight, powerful Docker management UI focused on simplicity and performance."
  },
  "features": {
    "badge": "Desktop App",
    "title": "Lightweight Docker Management",
    "description": "Experience Docker management reimagined - ultra-lightweight and blazing fast. Built with Tauri and Rust, Dockerman uses minimal system resources while delivering instant response times. Streamlined interface with essential features for efficient container management.",
    "stats": {
      "performance": "Performance",
      "bundleSize": "Bundle Size",
      "memoryUsage": "Memory Usage"
    }
  },
  "faqs": {
    "title": "Frequently Asked Questions",
    "description": "Can't find the answer you're looking for? Don't hesitate to get in touch with",
    "openIssues": "open issues",
    "descriptionSuffix": "on GitHub.",
    "items": [
      {
        "question": "Which operating systems does Dockerman support?",
        "answer": "Dockerman supports macOS, Windows, and major Linux distributions. Built with Tauri and Rust, it provides consistent performance and experience across various operating systems."
      },
      {
        "question": "Does Dockerman require an internet connection?",
        "answer": "Dockerman is a local application that doesn't require an internet connection. It runs entirely on your device, ensuring your data security and privacy."
      },
      {
        "question": "Where is SSH data stored?",
        "answer": "SSH data is stored on your device and is never uploaded to any server."
      },
      {
        "question": "What makes Dockerman different from other Docker management tools?",
        "answer": "Dockerman stands out with its focus on speed and efficiency. It features fast startup times, minimal resource usage (<30MB memory), real-time container monitoring, and a clean, focused interface that prioritizes the most common Docker tasks."
      }
    ]
  },
  "cta": {
    "title": "Ready to get started?",
    "description": "Start managing your Docker containers with a lightweight, powerful desktop experience.",
    "learnMore": "Want to learn more?"
  },
  "footer": {
    "description": "A modern, lightweight Docker management UI. Built with ❤️ for developers around the world.",
    "product": "Product",
    "resources": "Resources",
    "company": "Company",
    "legal": "Legal",
    "copyright": "Dockerman. All rights reserved.",
    "status": "All systems operational",
    "links": {
      "download": "Download",
      "changelog": "Changelog",
      "github": "GitHub",
      "about": "About",
      "privacy": "Privacy",
      "terms": "Terms",
      "dpa": "DPA"
    }
  },
  "common": {
    "download": "Download"
  }
}
```

**Step 2: Create Chinese translation file**

Create `src/locales/zh.json`:

```json
{
  "nav": {
    "home": "首页",
    "download": "下载",
    "changelog": "更新日志"
  },
  "hero": {
    "title": "现代化 Docker",
    "titleBreak": "管理更简单",
    "description": "轻量、强大的 Docker 管理界面，专注于简洁和性能。"
  },
  "features": {
    "badge": "桌面应用",
    "title": "轻量级 Docker 管理",
    "description": "重新定义 Docker 管理体验 - 超轻量且极速响应。基于 Tauri 和 Rust 构建，Dockerman 占用极少的系统资源，同时提供即时响应。精简的界面包含高效容器管理所需的核心功能。",
    "stats": {
      "performance": "性能",
      "bundleSize": "安装包大小",
      "memoryUsage": "内存占用"
    }
  },
  "faqs": {
    "title": "常见问题",
    "description": "找不到您需要的答案？欢迎在 GitHub 上",
    "openIssues": "提交 Issue",
    "descriptionSuffix": "与我们联系。",
    "items": [
      {
        "question": "Dockerman 支持哪些操作系统？",
        "answer": "Dockerman 支持 macOS、Windows 和主流 Linux 发行版。基于 Tauri 和 Rust 构建，在各种操作系统上提供一致的性能和体验。"
      },
      {
        "question": "Dockerman 需要联网吗？",
        "answer": "Dockerman 是一个本地应用程序，不需要联网。它完全在您的设备上运行，确保您的数据安全和隐私。"
      },
      {
        "question": "SSH 数据存储在哪里？",
        "answer": "SSH 数据存储在您的设备上，不会上传到任何服务器。"
      },
      {
        "question": "Dockerman 与其他 Docker 管理工具有什么不同？",
        "answer": "Dockerman 以速度和效率为核心。它具有快速启动、极低资源占用（<30MB 内存）、实时容器监控，以及专注于最常用 Docker 任务的简洁界面。"
      }
    ]
  },
  "cta": {
    "title": "准备好开始了吗？",
    "description": "使用轻量、强大的桌面应用开始管理您的 Docker 容器。",
    "learnMore": "想了解更多？"
  },
  "footer": {
    "description": "现代、轻量的 Docker 管理界面。用 ❤️ 为全球开发者打造。",
    "product": "产品",
    "resources": "资源",
    "company": "公司",
    "legal": "法律",
    "copyright": "Dockerman. 保留所有权利。",
    "status": "所有系统正常运行",
    "links": {
      "download": "下载",
      "changelog": "更新日志",
      "github": "GitHub",
      "about": "关于",
      "privacy": "隐私政策",
      "terms": "服务条款",
      "dpa": "DPA"
    }
  },
  "common": {
    "download": "下载"
  }
}
```

**Step 3: Commit**

```bash
git add src/locales/
git commit -m "feat: add English and Chinese translation files"
```

---

## Task 4: Create Middleware for Language Detection

**Files:**
- Create: `middleware.ts`

**Step 1: Create middleware**

Create `middleware.ts` in project root:

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, cookieName, type Locale } from '@/lib/i18n'

function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') || ''
  if (acceptLanguage.toLowerCase().includes('zh')) {
    return 'zh'
  }
  return defaultLocale
}

function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next()
  }

  // Check if path already has locale
  const pathLocale = getLocaleFromPath(pathname)
  if (pathLocale) {
    // Set cookie if not already set
    const response = NextResponse.next()
    response.cookies.set(cookieName, pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
    return response
  }

  // Get locale from cookie or headers
  const cookieLocale = request.cookies.get(cookieName)?.value as Locale | undefined
  const locale = cookieLocale && locales.includes(cookieLocale)
    ? cookieLocale
    : getLocaleFromHeaders(request)

  // Redirect to localized path
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  response.cookies.set(cookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
  return response
}

export const config = {
  matcher: ['/((?!_next|api|images|favicon.ico|opengraph-image.png|.*\\..*).*)'],
}
```

**Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add i18n middleware for language detection and routing"
```

---

## Task 5: Create I18nProvider Component

**Files:**
- Create: `src/components/I18nProvider.tsx`

**Step 1: Create provider component**

Create `src/components/I18nProvider.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { type Locale } from '@/lib/i18n'
import '@/lib/i18n/client'

interface I18nProviderProps {
  children: React.ReactNode
  locale: Locale
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  useEffect(() => {
    if (i18next.resolvedLanguage !== locale) {
      i18next.changeLanguage(locale)
    }
  }, [locale])

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}
```

**Step 2: Commit**

```bash
git add src/components/I18nProvider.tsx
git commit -m "feat: add I18nProvider component"
```

---

## Task 6: Create LanguageSwitcher Component

**Files:**
- Create: `src/components/ui/LanguageSwitcher.tsx`

**Step 1: Create language switcher**

Create `src/components/ui/LanguageSwitcher.tsx`:

```typescript
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { RiGlobalLine } from '@remixicon/react'
import { type Locale, locales, cookieName } from '@/lib/i18n'

const languageNames: Record<Locale, string> = {
  en: 'EN',
  zh: '中',
}

const languageFullNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    // Set cookie
    document.cookie = `${cookieName}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`

    // Replace locale in path
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    router.push(newPath)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Switch language"
        className="flex size-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium">{languageNames[currentLocale]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {locales.map((locale) => (
            <button
              key={locale}
              className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                locale === currentLocale
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => switchLocale(locale)}
            >
              {languageFullNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/LanguageSwitcher.tsx
git commit -m "feat: add LanguageSwitcher component"
```

---

## Task 7: Create Locale Layout and Restructure App Directory

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create locale layout**

Create `src/app/[locale]/layout.tsx`:

```typescript
import { type Locale, locales } from '@/lib/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { siteConfig } from '@/app/siteConfig'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  const titles: Record<Locale, string> = {
    en: 'Dockerman - Modern Docker Management UI',
    zh: 'Dockerman - 现代化 Docker 管理界面',
  }

  const descriptions: Record<Locale, string> = {
    en: siteConfig.description,
    zh: '基于 Tauri 和 Rust 构建的现代轻量级 Docker 管理界面，专注于简洁和性能。',
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  )
}
```

**Step 2: Create locale home page**

Create `src/app/[locale]/page.tsx`:

```typescript
import Cta from '@/components/ui/Cta'
import { Faqs } from '@/components/ui/Faqs'
import Features from '@/components/ui/Features'
import Hero from '@/components/ui/Hero'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl overflow-hidden">
      <Hero />
      <Features />
      <Faqs />
      <Cta />
    </main>
  )
}
```

**Step 3: Update root layout to use locale from params**

Modify `src/app/layout.tsx` - update the `<html>` tag to be dynamic:

```typescript
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Footer from '@/components/ui/Footer'
import { Navigation } from '@/components/ui/Navbar'
import './globals.css'
import { siteConfig } from './siteConfig'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://dockerman.app'),
  title: 'Dockerman - Modern Docker Management UI',
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
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Step 4: Update root page to redirect**

Modify `src/app/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { cookieName, defaultLocale, locales, type Locale } from '@/lib/i18n'

export default async function RootPage() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const cookieLocale = cookieStore.get(cookieName)?.value as Locale | undefined

  if (cookieLocale && locales.includes(cookieLocale)) {
    redirect(`/${cookieLocale}`)
  }

  const acceptLanguage = headerStore.get('accept-language') || ''
  const locale = acceptLanguage.toLowerCase().includes('zh') ? 'zh' : defaultLocale

  redirect(`/${locale}`)
}
```

**Step 5: Commit**

```bash
git add src/app/[locale]/ src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add locale-based routing structure"
```

---

## Task 8: Update Navbar with Language Switcher

**Files:**
- Modify: `src/components/ui/Navbar.tsx`

**Step 1: Add language switcher to Navbar**

Update `src/components/ui/Navbar.tsx` to:
1. Import LanguageSwitcher
2. Import useParams to get current locale
3. Import useTranslation for translated nav links
4. Add LanguageSwitcher next to ThemeToggleButton

Add imports at top:

```typescript
import { useParams } from 'next/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
```

Update Navigation component to use translations and add LanguageSwitcher:

```typescript
export function Navigation() {
  const scrolled = useScroll(15)
  const [open, setOpen] = React.useState(false)
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  // ... existing useEffect ...

  return (
    <header ...>
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          {/* ... Logo ... */}
          <nav className="hidden md:absolute md:top-1/2 md:left-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={`/${locale}`}
              >
                {t('nav.home')}
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={`/${locale}/download`}
              >
                {t('nav.download')}
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={`/${locale}/changelog`}
              >
                {t('nav.changelog')}
              </Link>
            </div>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggleButton />
            {/* ... Download button ... */}
          </div>

          <div className="flex gap-x-2 md:hidden">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggleButton />
            {/* ... rest of mobile nav ... */}
          </div>
        </div>
        {/* Update mobile menu links similarly */}
        <nav className={cx('my-6 flex text-lg ease-in-out will-change-transform md:hidden', open ? '' : 'hidden')}>
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <a href={`/${locale}`}>{t('nav.home')}</a>
            </li>
            <li onClick={() => setOpen(false)}>
              <a href={`/${locale}/download`}>{t('nav.download')}</a>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={`/${locale}/changelog`}>{t('nav.changelog')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
```

**Step 2: Verify dev server runs**

Run:
```bash
pnpm dev
```

Expected: Server starts without errors, can navigate to `/en` and `/zh`

**Step 3: Commit**

```bash
git add src/components/ui/Navbar.tsx
git commit -m "feat: integrate LanguageSwitcher into Navbar"
```

---

## Task 9: Update Hero Component with Translations

**Files:**
- Modify: `src/components/ui/Hero.tsx`

**Step 1: Convert to client component and add translations**

Update `src/components/ui/Hero.tsx`:

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
import HeroImage from './HeroImage'
import TrackedHeroButton from './TrackedHeroButton'

export default function Hero() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  return (
    <section
      aria-labelledby="hero-title"
      className="mt-32 flex flex-col items-center justify-center text-center sm:mt-40"
    >
      <h1
        className="inline-block animate-slide-up-fade bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text p-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-7xl dark:from-gray-50 dark:to-gray-300"
        id="hero-title"
        style={{ animationDuration: '700ms' }}
      >
        {t('hero.title')} <br />
        {t('hero.titleBreak')}
      </h1>
      <p
        className="mt-6 max-w-lg animate-slide-up-fade text-gray-700 text-lg dark:text-gray-400"
        style={{ animationDuration: '900ms' }}
      >
        {t('hero.description')}
      </p>
      <div
        className="mt-8 flex w-full animate-slide-up-fade justify-center gap-3 px-3 sm:flex-row"
        style={{ animationDuration: '1100ms' }}
      >
        <TrackedHeroButton />
      </div>
      <div
        className="relative mx-auto mt-20 ml-3 h-fit w-[40rem] max-w-6xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"
        style={{ animationDuration: '1400ms' }}
      >
        <HeroImage />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-24 -mx-10 h-2/4 bg-gradient-to-t from-white via-white to-transparent lg:h-1/4 dark:from-gray-950 dark:via-gray-950"
        />
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/Hero.tsx
git commit -m "feat: add i18n to Hero component"
```

---

## Task 10: Update Features Component with Translations

**Files:**
- Modify: `src/components/ui/Features.tsx`

**Step 1: Convert to client component and add translations**

Update `src/components/ui/Features.tsx`:

```typescript
'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
import { Badge } from '../Badge'

const stats = [
  { key: 'performance', value: '~0ms' },
  { key: 'bundleSize', value: '<10MB' },
  { key: 'memoryUsage', value: '<30MB' },
]

export default function Features() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto mt-32 w-full max-w-6xl px-3 md:mt-44"
    >
      <Badge>{t('features.badge')}</Badge>
      <h2
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        id="features-title"
      >
        {t('features.title')}
      </h2>
      <p className="mt-6 max-w-3xl text-gray-600 text-lg leading-7 dark:text-gray-400">
        {t('features.description')}
      </p>
      <dl className="mt-12 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:border-gray-200 md:border-y md:py-14 dark:border-gray-800">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="border-indigo-100 border-l-2 pl-6 md:border-l md:text-center lg:border-gray-200 lg:first:border-none dark:border-indigo-900 lg:dark:border-gray-800">
              <dd className="inline-block bg-gradient-to-t from-indigo-900 to-indigo-600 bg-clip-text font-bold text-5xl text-transparent tracking-tight lg:text-6xl dark:from-indigo-700 dark:to-indigo-400">
                {stat.value}
              </dd>
              <dt className="mt-1 text-gray-600 dark:text-gray-400">
                {t(`features.stats.${stat.key}`)}
              </dt>
            </div>
          </React.Fragment>
        ))}
      </dl>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/Features.tsx
git commit -m "feat: add i18n to Features component"
```

---

## Task 11: Update Faqs Component with Translations

**Files:**
- Modify: `src/components/ui/Faqs.tsx`

**Step 1: Update with translations**

Update `src/components/ui/Faqs.tsx`:

```typescript
'use client'

import { useParams } from 'next/navigation'
import posthog from 'posthog-js'
import { siteConfig } from '@/app/siteConfig'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../Accordion'

export function Faqs() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  const faqs = t('faqs.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  return (
    <section aria-labelledby="faq-title" className="mt-20 sm:mt-36">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-14">
        <div className="col-span-full sm:col-span-5">
          <h2
            className="inline-block scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 pr-2 font-bold text-2xl text-transparent tracking-tighter lg:text-3xl dark:from-gray-50 dark:to-gray-300"
            id="faq-title"
          >
            {t('faqs.title')}
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-7 dark:text-gray-400">
            {t('faqs.description')}{' '}
            <a
              className="font-medium text-indigo-600 hover:text-indigo-300 dark:text-indigo-400"
              href={siteConfig.issuesLink}
            >
              {t('faqs.openIssues')}
            </a>{' '}
            {t('faqs.descriptionSuffix')}
          </p>
        </div>
        <div className="col-span-full mt-6 lg:col-span-7 lg:mt-0">
          <Accordion
            className="mx-auto"
            onValueChange={(value) => {
              if (value.length > 0) {
                const lastExpandedQuestion = value.at(-1)
                const faqIndex = faqs.findIndex((faq) => faq.question === lastExpandedQuestion)
                posthog.capture('faq_item_expanded', {
                  question: lastExpandedQuestion,
                  faq_index: faqIndex
                })
              }
            }}
            type="multiple"
          >
            {faqs.map((item) => (
              <AccordionItem
                className="py-3 first:pt-0 first:pb-3"
                key={item.question}
                value={item.question}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/Faqs.tsx
git commit -m "feat: add i18n to Faqs component"
```

---

## Task 12: Update Cta Component with Translations

**Files:**
- Modify: `src/components/ui/Cta.tsx`

**Step 1: Convert to client component and add translations**

Update `src/components/ui/Cta.tsx`:

```typescript
'use client'

import { useParams } from 'next/navigation'
import Balancer from 'react-wrap-balancer'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
import { TrackedChangelogLink, TrackedCtaDownloadButton } from './TrackedCtaButtons'

export default function Cta() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  return (
    <section
      aria-labelledby="cta-title"
      className="mx-auto mt-32 mb-20 max-w-6xl p-1 px-2 sm:mt-56"
    >
      <div className="relative flex items-center justify-center">
        <div className="max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <h3
                className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text p-2 font-bold text-4xl text-transparent tracking-tighter md:text-6xl dark:from-gray-50 dark:to-gray-300"
                id="cta-title"
              >
                {t('cta.title')}
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 sm:text-lg dark:text-gray-400">
                <Balancer>
                  {t('cta.description')}
                </Balancer>
              </p>
            </div>
            <div className="mt-14 rounded-[16px] bg-gray-300/5 p-1.5 ring-1 ring-black/[3%] backdrop-blur dark:bg-gray-900/10 dark:ring-white/[3%]">
              <div className="rounded-xl bg-white p-4 shadow-indigo-500/10 shadow-lg ring-1 ring-black/5 dark:bg-gray-950 dark:shadow-indigo-500/10 dark:ring-white/5">
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <TrackedCtaDownloadButton />
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-xs sm:text-sm dark:text-gray-400">
              {t('cta.learnMore')} <TrackedChangelogLink />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/Cta.tsx
git commit -m "feat: add i18n to Cta component"
```

---

## Task 13: Update Footer Component with Translations

**Files:**
- Modify: `src/components/ui/Footer.tsx`

**Step 1: Convert to client component and add translations**

Update `src/components/ui/Footer.tsx`:

```typescript
'use client'

import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Logo } from '../../../public/logo'
import ThemeSwitch from '../ThemeSwitch'
import { TrackedExternalLink } from './TrackedFooterLinks'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'

export default function Footer() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  const navigation = {
    product: [
      { name: t('footer.links.download'), href: `/${locale}/download`, external: false },
      { name: t('footer.links.changelog'), href: `/${locale}/changelog`, external: false }
    ],
    resources: [
      {
        name: t('footer.links.github'),
        href: 'https://github.com/ZingerLittleBee/dockerman.app',
        external: true
      }
    ],
    company: [
      { name: t('footer.links.about'), href: `/${locale}/about`, external: false }
    ],
    legal: [
      { name: t('footer.links.privacy'), href: `/${locale}/privacy`, external: false },
      { name: t('footer.links.terms'), href: `/${locale}/terms`, external: false },
      { name: t('footer.links.dpa'), href: `/${locale}/dpa`, external: false }
    ]
  }

  return (
    <footer id="footer">
      <div className="mx-auto max-w-6xl px-3 pt-16 pb-8 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-20">
          <div className="space-y-8">
            <Logo className="w-32 sm:w-40" />
            <p className="text-gray-600 text-sm leading-6 dark:text-gray-400">
              {t('footer.description')}
            </p>
            <div className="flex space-x-6">
              <ThemeSwitch />
            </div>
            <div />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.product')}
                </h3>
                <ul aria-label="Quick links Product" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <Link
                        className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        target={item.external ? '_blank' : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.resources')}
                </h3>
                <ul aria-label="Quick links Resources" className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li className="w-fit" key={item.name}>
                      {item.external ? (
                        <TrackedExternalLink
                          href={item.href}
                          name={item.name}
                          section="resources"
                        />
                      ) : (
                        <Link
                          className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                          href={item.href}
                        >
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.company')}
                </h3>
                <ul aria-label="Quick links Company" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <Link
                        className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        target={item.external ? '_blank' : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.legal')}
                </h3>
                <ul aria-label="Quick links Legal" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <Link
                        className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        href={item.href}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        target={item.external ? '_blank' : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-gray-200 border-t pt-8 sm:mt-20 sm:flex-row lg:mt-24 dark:border-gray-800">
          <p className="text-gray-500 text-sm leading-5 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="rounded-full border border-gray-200 py-1 pr-2 pl-1 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <div className="relative size-4 shrink-0">
                <div className="absolute inset-[1px] rounded-full bg-emerald-500/20 dark:bg-emerald-600/20" />
                <div className="absolute inset-1 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              </div>
              <span className="text-gray-700 text-xs dark:text-gray-50">
                {t('footer.status')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/Footer.tsx
git commit -m "feat: add i18n to Footer component"
```

---

## Task 14: Move Existing Pages to Locale Directory

**Files:**
- Move/Create: `src/app/[locale]/download/page.tsx`
- Move/Create: `src/app/[locale]/about/page.tsx`
- Move/Create: `src/app/[locale]/changelog/page.tsx`
- Move/Create: `src/app/[locale]/privacy/page.tsx`
- Move/Create: `src/app/[locale]/terms/page.tsx`
- Move/Create: `src/app/[locale]/dpa/page.tsx`

**Step 1: Create locale download page**

Create `src/app/[locale]/download/page.tsx`:

```typescript
import Download from '@/components/ui/Download'

export default function DownloadPage() {
  return (
    <main>
      <Download />
    </main>
  )
}
```

**Step 2: Create locale about page**

Create `src/app/[locale]/about/page.tsx`:

Copy content from existing `src/app/about/page.tsx`

**Step 3: Create locale changelog directory**

This will be handled in Task 15 for MDX multi-language support.

**Step 4: Create locale privacy page**

Create `src/app/[locale]/privacy/page.tsx`:

Copy content from existing `src/app/privacy/page.tsx`

**Step 5: Create locale terms page**

Create `src/app/[locale]/terms/page.tsx`:

Copy content from existing `src/app/terms/page.tsx`

**Step 6: Create locale dpa page**

Create `src/app/[locale]/dpa/page.tsx`:

Copy content from existing `src/app/dpa/page.tsx`

**Step 7: Commit**

```bash
git add src/app/[locale]/
git commit -m "feat: migrate pages to locale directory structure"
```

---

## Task 15: Set Up MDX Multi-language Support

**Files:**
- Create: `src/content/changelog/en.mdx`
- Create: `src/content/changelog/zh.mdx`
- Create: `src/app/[locale]/changelog/page.tsx`
- Create: `src/app/[locale]/changelog/layout.tsx`

**Step 1: Create content directory and copy English changelog**

```bash
mkdir -p src/content/changelog
```

Copy existing `src/app/changelog/page.mdx` content to `src/content/changelog/en.mdx`

**Step 2: Create Chinese changelog**

Create `src/content/changelog/zh.mdx` with translated content (or placeholder for now).

**Step 3: Create changelog page with dynamic MDX loading**

Create `src/app/[locale]/changelog/page.tsx`:

```typescript
import { type Locale } from '@/lib/i18n'

async function getChangelog(locale: Locale) {
  try {
    const Content = (await import(`@/content/changelog/${locale}.mdx`)).default
    return Content
  } catch {
    // Fallback to English
    const Content = (await import('@/content/changelog/en.mdx')).default
    return Content
  }
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const Content = await getChangelog(locale)

  return <Content />
}
```

**Step 4: Create changelog layout**

Create `src/app/[locale]/changelog/layout.tsx`:

Copy from existing `src/app/changelog/layout.tsx`

**Step 5: Update next.config for MDX in content directory**

Ensure `next.config.mjs` includes the content directory for MDX processing.

**Step 6: Commit**

```bash
git add src/content/ src/app/[locale]/changelog/
git commit -m "feat: add MDX multi-language support for changelog"
```

---

## Task 16: Update TrackedHeroButton and TrackedCtaButtons

**Files:**
- Modify: `src/components/ui/TrackedHeroButton.tsx`
- Modify: `src/components/ui/TrackedCtaButtons.tsx`

**Step 1: Update TrackedHeroButton to use locale-aware links**

Add locale from useParams and update download link to `/${locale}/download`.

**Step 2: Update TrackedCtaButtons to use locale-aware links**

Add locale from useParams and update links to use locale prefix.

**Step 3: Commit**

```bash
git add src/components/ui/TrackedHeroButton.tsx src/components/ui/TrackedCtaButtons.tsx
git commit -m "feat: add locale-aware links to tracked buttons"
```

---

## Task 17: Clean Up Old Page Files

**Files:**
- Delete: Original pages in `src/app/` that are now under `[locale]/`

**Step 1: Remove old page files**

After verifying locale-based routing works, remove:
- `src/app/download/` (keep if needed for redirect)
- `src/app/about/`
- `src/app/changelog/`
- `src/app/privacy/`
- `src/app/terms/`
- `src/app/dpa/`

Or convert them to redirect to locale versions.

**Step 2: Commit**

```bash
git add -A
git commit -m "refactor: clean up old page files after i18n migration"
```

---

## Task 18: Final Verification

**Step 1: Run dev server and test**

Run:
```bash
pnpm dev
```

Test:
1. Visit `/` - should redirect based on browser language
2. Visit `/en` - should show English content
3. Visit `/zh` - should show Chinese content
4. Click language switcher - should switch languages
5. Verify cookie is set after language selection
6. Verify all navigation links work with locale prefix

**Step 2: Run build**

Run:
```bash
pnpm build
```

Expected: Build completes without errors

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete i18n implementation"
```

---

Plan complete and saved to `docs/plans/2026-01-30-i18n-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
