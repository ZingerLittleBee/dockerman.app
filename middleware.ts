import { type NextRequest, NextResponse } from 'next/server'
import { cookieName, defaultLocale, type Locale, locales } from '@/lib/i18n'

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
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    return response
  }

  // Get locale from cookie or headers
  const cookieLocale = request.cookies.get(cookieName)?.value as Locale | undefined
  const locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : getLocaleFromHeaders(request)

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
