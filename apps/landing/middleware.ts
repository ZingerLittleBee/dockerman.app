import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { type NextRequest, NextResponse } from 'next/server'

const BOT_UA_REGEX =
  /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|applebot/i

function isBot(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') || ''
  return BOT_UA_REGEX.test(ua)
}

function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') || ''
  const lang = acceptLanguage.toLowerCase()
  if (lang.includes('zh')) return 'zh'
  if (lang.includes('ja')) return 'ja'
  if (lang.includes('es')) return 'es'
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

function withLocaleHeader(response: NextResponse, locale: Locale): NextResponse {
  response.headers.set('x-locale', locale)
  return response
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
    const existing = request.cookies.get(cookieName)?.value
    if (existing === pathLocale) {
      return withLocaleHeader(NextResponse.next(), pathLocale)
    }

    const response = NextResponse.next()
    response.cookies.set(cookieName, pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    return withLocaleHeader(response, pathLocale)
  }

  // For bots/crawlers, always redirect to defaultLocale so every locale URL stays
  // independently crawlable and we don't gate non-default languages behind
  // Accept-Language detection (Googlebot is always en-US).
  const locale = isBot(request)
    ? defaultLocale
    : (() => {
        const cookieLocale = request.cookies.get(cookieName)?.value as Locale | undefined
        return cookieLocale && locales.includes(cookieLocale)
          ? cookieLocale
          : getLocaleFromHeaders(request)
      })()

  // Redirect to localized path
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  response.cookies.set(cookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  })
  return withLocaleHeader(response, locale)
}

export const config = {
  matcher: ['/((?!_next|api|images|favicon.ico|opengraph-image.png|.*\\..*).*)']
}
