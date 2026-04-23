'use client'

import { useEffect, useState } from 'react'

type ResultIcon = 'box' | 'layers' | 'arrow' | 'logs' | 'k8s' | 'compose' | 'play'

type Result = {
  t: string
  n: string
  s: string
  ico: ResultIcon
}

type Query = {
  q: string
  results: Result[]
}

const QUERIES: Query[] = [
  {
    q: 'redis',
    results: [
      { t: 'container', n: 'test-redis-1', s: 'running · :6379', ico: 'box' },
      { t: 'image', n: 'redis:7.2-alpine', s: '41 MB · 3 tags', ico: 'layers' },
      { t: 'action', n: 'pull redis:latest', s: 'upgrade available', ico: 'arrow' },
    ],
  },
  {
    q: 'logs web',
    results: [
      { t: 'container', n: 'test-web-1 / logs', s: 'follow · regex', ico: 'logs' },
      { t: 'container', n: 'exlo-web / logs', s: '1.2k lines · paused', ico: 'logs' },
      { t: 'pod', n: 'web-7d4f8b / logs', s: 'k8s · default ns', ico: 'k8s' },
    ],
  },
  {
    q: 'compose',
    results: [
      { t: 'project', n: 'monorepo-dev', s: '4 services · up', ico: 'compose' },
      { t: 'project', n: 'staging-stack', s: '7 services · partial', ico: 'compose' },
      { t: 'action', n: 'compose up -d', s: 'current project', ico: 'play' },
    ],
  },
]

const ICONS: Record<ResultIcon, React.ReactNode> = {
  box: (
    <>
      <rect height="13" rx="2" width="18" x="3" y="7" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5M3 18l9 5 9-5" />
    </>
  ),
  arrow: <path d="M12 4v12M7 9l5-5 5 5" />,
  logs: <path d="M4 6h16M4 12h16M4 18h10" />,
  k8s: <path d="M12 2l9 5v10l-9 5-9-5V7z" />,
  compose: (
    <>
      <rect height="7" width="7" x="3" y="3" />
      <rect height="7" width="7" x="14" y="3" />
      <rect height="7" width="7" x="3" y="14" />
      <rect height="7" width="7" x="14" y="14" />
    </>
  ),
  play: <path d="M6 4l14 8-14 8V4z" />,
}

/**
 * Typewriter palette preview used inside the "command palette" feature card.
 * Mirrors palette.js behavior: types a query, holds, erases, moves to next.
 * Honors prefers-reduced-motion by rendering a static snapshot.
 */
export function PaletteViz() {
  const [qi, setQi] = useState(0)
  const [text, setText] = useState('')
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) {
      setText(QUERIES[qi]?.q ?? '')
      return
    }
    let ci = 0
    let typing = true
    let timer: ReturnType<typeof setTimeout> | undefined
    const tick = () => {
      const current = QUERIES[qi]
      if (!current) return
      if (typing) {
        ci++
        if (ci > current.q.length) {
          typing = false
          timer = setTimeout(tick, 1800)
          return
        }
        setText(current.q.slice(0, ci))
        timer = setTimeout(tick, 110)
      } else {
        ci--
        if (ci <= 0) {
          typing = true
          setText('')
          setQi((q) => (q + 1) % QUERIES.length)
          return
        }
        setText(current.q.slice(0, ci))
        timer = setTimeout(tick, 40)
      }
    }
    timer = setTimeout(tick, 800)
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [qi, reduced])

  const currentResults = QUERIES[qi]?.results ?? []
  const showResults = text.length > 0

  return (
    <div
      className="overflow-hidden rounded-[10px] border border-dm-line-strong bg-dm-bg shadow-[0_20px_40px_-20px_rgb(0_0_0_/_0.35)]"
    >
      <div className="flex items-center gap-[10px] border-dm-line border-b bg-dm-bg-soft px-[14px] py-3">
        <svg
          aria-hidden="true"
          fill="none"
          height="14"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--color-dm-ink-3)' }}
          viewBox="0 0 24 24"
          width="14"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <div className="font-[var(--font-dm-mono)] text-[13px] text-dm-ink">
          {text}
          <span
            aria-hidden="true"
            className="inline-block h-[14px] w-[6px] align-middle ml-[2px]"
            style={{
              background: 'var(--color-dm-accent)',
              animation: reduced ? undefined : 'dm-pulse 1s steps(1) infinite',
            }}
          />
        </div>
        <span
          className="ml-auto rounded border border-dm-line px-[5px] py-[1px] font-[var(--font-dm-mono)] text-[10px] text-dm-ink-4"
        >
          ⌘;
        </span>
      </div>
      <div className="p-[6px]">
        {showResults
          ? currentResults.map((r, i) => (
              <div
                className="flex items-center gap-[10px] rounded-md px-[10px] py-[7px] text-[12px]"
                key={r.n}
                style={{
                  background:
                    i === 0
                      ? 'color-mix(in srgb, var(--color-dm-accent) 12%, transparent)'
                      : 'transparent',
                }}
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="13"
                  stroke={i === 0 ? 'var(--color-dm-accent)' : 'var(--color-dm-ink-3)'}
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="13"
                >
                  {ICONS[r.ico]}
                </svg>
                <span
                  className="font-[var(--font-dm-mono)] font-medium"
                  style={{
                    color: i === 0 ? 'var(--color-dm-ink)' : 'var(--color-dm-ink-2)',
                  }}
                >
                  {r.n}
                </span>
                <span className="ml-auto font-[var(--font-dm-mono)] text-[10.5px] text-dm-ink-4">
                  {r.t} · {r.s}
                </span>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}
