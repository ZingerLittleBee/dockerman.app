import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'
import { type NextRequest, NextResponse } from 'next/server'

// `bot` already covers googlebot/bingbot/duckduckbot/discordbot/etc., so we
// only add the crawlers that don't carry "bot" in their UA.
const BOT_UA_REGEX =
  /bot|crawler|spider|yandex|baiduspider|facebookexternalhit|whatsapp|applebot/i

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
      return NextResponse.next()
    }

    const response = NextResponse.next()
    response.cookies.set(cookieName, pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    return response
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
  return response
}

export const config = {
  matcher: ['/((?!_next|api|images|favicon.ico|opengraph-image.png|.*\\..*).*)']
}
