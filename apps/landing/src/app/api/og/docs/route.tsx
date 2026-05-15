import { locales } from '@repo/shared/i18n'
import { ImageResponse } from 'next/og'
import { type NextRequest, NextResponse } from 'next/server'
import { source } from '@/lib/source'

// Cached for a day at the CDN. Not force-static: that would freeze the route
// at build time with no search params, so every doc would share one image.
export const revalidate = 86400

// Resolve title/description from the docs source by slug instead of trusting
// query params. Unknown slugs 404, so the cache surface is bounded to the
// real set of doc pages and attacker-controlled text can't be baked in.
export function GET(request: NextRequest) {
  const url = new URL(request.url)
  const localeParam = url.searchParams.get('locale') ?? 'en'
  const slugParam = url.searchParams.get('slug') ?? ''

  if (!(locales as readonly string[]).includes(localeParam)) {
    return new NextResponse('Invalid locale', { status: 400 })
  }

  const slug = slugParam ? slugParam.split('/').filter(Boolean) : undefined
  const page = source.getPage(slug, localeParam)
  if (!page) {
    return new NextResponse('Not found', { status: 404 })
  }

  const title = page.data.title ?? 'Dockerman Docs'
  const description = page.data.description ?? ''
  const locale = localeParam.toUpperCase()

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.25), transparent 55%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.2), transparent 60%)',
        color: 'white',
        fontFamily: 'sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          }}
        />
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Dockerman Docs
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            maxWidth: 1040
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.35,
              maxWidth: 980
            }}
          >
            {description.length > 160 ? `${description.slice(0, 157)}…` : description}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          color: 'rgba(255,255,255,0.55)'
        }}
      >
        <div>dockerman.app</div>
        <div>{locale}</div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
