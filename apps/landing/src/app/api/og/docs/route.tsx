import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(request: NextRequest) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') ?? 'Dockerman Docs'
  const description = url.searchParams.get('description') ?? ''
  const locale = (url.searchParams.get('locale') ?? 'en').toUpperCase()

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
