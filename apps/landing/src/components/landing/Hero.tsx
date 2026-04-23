'use client'

import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { downloadsConfig } from '@/config/downloads'

const INSTALL_CMD = downloadsConfig.homebrewCommand

type OS = 'mac' | 'windows' | 'linux'

const OS_META: Record<OS, { label: string; size: string }> = {
  mac: { label: 'Download for macOS', size: downloadsConfig.latest.installers.macos[0].size },
  windows: {
    label: 'Download for Windows',
    size: downloadsConfig.latest.installers.windows[0].size
  },
  linux: { label: 'Download for Linux', size: downloadsConfig.latest.installers.linux[0].size }
}

const WINDOWS_RE = /Win/i
const LINUX_RE = /Linux/i
const ANDROID_RE = /Android/i

function detectOS(): OS {
  if (typeof navigator === 'undefined') {
    return 'mac'
  }
  const ua = navigator.userAgent
  if (WINDOWS_RE.test(ua)) {
    return 'windows'
  }
  if (LINUX_RE.test(ua) && !ANDROID_RE.test(ua)) {
    return 'linux'
  }
  return 'mac'
}

export function Hero({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false)
  const [os, setOs] = useState<OS>('mac')

  useEffect(() => {
    setOs(detectOS())
  }, [])

  const { label: downloadLabel, size: downloadSize } = OS_META[os]

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <section className="relative overflow-hidden px-8 pt-16 pb-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-[1] h-[500px] w-[900px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent) 25%, transparent), transparent 60%)'
        }}
      />
      <div className="relative mx-auto max-w-[1240px]">
        <HeroStage />
        {/* Eyebrow: pulsing dot + version note + NEW tag */}
        <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev px-[10px] py-[5px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
              animation: 'dm-pulse 2.2s ease-in-out infinite'
            }}
          />
          <span>v5.1.0 — Podman support, Cloudflared tunnels, image-upgrade detection</span>
          <span className="rounded-full bg-dm-ink px-2 py-[2px] font-semibold text-[10px] text-dm-bg tracking-[0.04em]">
            NEW
          </span>
        </span>

        {/* Two-line headline with accent on `local` and `easy` */}
        <h1 className="mt-[22px] max-w-[14ch] font-bold text-[clamp(44px,7.2vw,96px)] text-dm-ink leading-[0.95] tracking-[-0.045em]">
          Docker that feels <Accent>local</Accent>.<br />
          Kubernetes that feels <Accent>easy</Accent>.
        </h1>

        <p className="mt-6 max-w-[52ch] text-[18px] text-dm-ink-3 leading-[1.5]">
          A lightweight desktop UI for Docker, Podman, and Kubernetes — built with Rust and Tauri.
          Boots in ~0ms and lives in under 30 MB of memory.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {/* Gradient download button */}
          <Link
            className="inline-flex items-center gap-[10px] rounded-[10px] border px-5 py-3 pr-[6px] font-semibold text-[14px] text-white no-underline transition-all hover:-translate-y-px"
            href={`/${locale}/download`}
            style={{
              background:
                'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
              borderColor: 'transparent',
              boxShadow:
                '0 10px 30px -10px color-mix(in srgb, var(--color-dm-accent-2) 60%, transparent)'
            }}
          >
            <svg aria-hidden="true" fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4v-2h14v2H5z" />
            </svg>
            {downloadLabel}
            <span
              className="inline-flex items-center gap-[6px] rounded-md px-[10px] py-1 font-[var(--font-dm-mono)] text-[11px]"
              style={{
                background: 'rgb(255 255 255 / 0.18)',
                opacity: 0.9
              }}
            >
              ↓ {downloadSize}
            </span>
          </Link>

          {/* Inline copy install command */}
          <button
            aria-label={copied ? 'Copied' : `Copy: ${INSTALL_CMD}`}
            className="inline-flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-dm-line bg-dm-bg-elev px-[14px] py-[10px] pr-3 font-[var(--font-dm-mono)] text-[13px] text-dm-ink-2 transition-colors hover:border-dm-line-strong"
            onClick={copyInstall}
            type="button"
          >
            <span style={{ color: 'var(--color-dm-accent)' }}>$</span>
            <span>{INSTALL_CMD}</span>
            <span
              aria-hidden="true"
              className="grid h-[22px] w-[22px] place-items-center rounded text-dm-ink-3"
              style={{ background: 'var(--color-dm-bg-soft)' }}
            >
              {copied ? (
                <svg
                  fill="none"
                  height="11"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="11"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  fill="none"
                  height="11"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="11"
                >
                  <rect height="13" rx="2" width="13" x="9" y="9" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Meta strip: OS + license + version */}
        <div className="mt-10 flex flex-wrap items-center gap-6 font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
          <span className="inline-flex items-center gap-2">
            <strong className="font-semibold text-dm-ink">macOS</strong>
          </span>
          <span className="h-[3px] w-[3px] rounded-full bg-dm-ink-4" />
          <span className="inline-flex items-center gap-2">
            <strong className="font-semibold text-dm-ink">Windows</strong>
          </span>
          <span className="h-[3px] w-[3px] rounded-full bg-dm-ink-4" />
          <span className="inline-flex items-center gap-2">
            <strong className="font-semibold text-dm-ink">Linux</strong>
          </span>
          <span className="h-[3px] w-[3px] rounded-full bg-dm-ink-4" />
          <span>local-first · opt-out analytics</span>
          <span className="h-[3px] w-[3px] rounded-full bg-dm-ink-4" />
          <span>v5.1.0 · Apr 8, 2026</span>
        </div>
      </div>
    </section>
  )
}

const TYPE_CMD = INSTALL_CMD
const TYPE_DURATION_MS = 2200
const STAGE_STEP_MS = 480

const STAGE_STEPS = {
  cmd: 0,
  tap: TYPE_DURATION_MS + 120,
  fetch: TYPE_DURATION_MS + 120 + STAGE_STEP_MS,
  progress: TYPE_DURATION_MS + 120 + STAGE_STEP_MS * 2,
  done: TYPE_DURATION_MS + 120 + STAGE_STEP_MS * 2 + 1200,
  cardsStart: TYPE_DURATION_MS + 120 + STAGE_STEP_MS * 2 + 1500
} as const

const STAGE_CONTAINERS = [
  { name: 'redis', img: 'redis:7', cpu: '2%', mem: '48 MB' },
  { name: 'postgres', img: 'postgres:16', cpu: '7%', mem: '214 MB' },
  { name: 'traefik', img: 'traefik:v3', cpu: '1%', mem: '84 MB' }
] as const

function HeroStage() {
  return (
    <div
      aria-hidden
      className="dm-animated pointer-events-none absolute top-[92px] right-0 hidden w-[440px] xl:block"
    >
      {/* ambient glow behind the stage */}
      <div
        className="absolute inset-0 -z-[1] blur-[60px]"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)'
        }}
      />

      <TerminalCard />

      <div className="mt-3 flex flex-col gap-2">
        {STAGE_CONTAINERS.map((c, i) => (
          <ContainerMini
            cpu={c.cpu}
            delayMs={STAGE_STEPS.cardsStart + i * 220}
            img={c.img}
            key={c.name}
            mem={c.mem}
          />
        ))}
      </div>
    </div>
  )
}

function TerminalCard() {
  return (
    <div
      className="overflow-hidden rounded-[14px] border border-dm-line-strong bg-dm-bg-elev"
      style={{ boxShadow: '0 20px 40px -20px rgb(0 0 0 / 0.35)' }}
    >
      {/* chrome */}
      <div className="flex h-[32px] items-center justify-between border-dm-line border-b px-4">
        <span className="font-[var(--font-dm-mono)] text-[11px] text-dm-ink-3">
          <span className="text-dm-ink-4">~/</span>downloads
        </span>
        <span className="inline-flex items-center gap-[6px] font-[var(--font-dm-mono)] text-[10.5px] text-dm-ink-3">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
              animation: 'dm-pulse 2.2s ease-in-out infinite'
            }}
          />
          live
        </span>
      </div>

      {/* body */}
      <div className="px-4 py-[14px] font-[var(--font-dm-mono)] text-[12.5px] text-dm-ink-2 leading-[1.65]">
        {/* prompt + typing */}
        <div className="flex items-center gap-[8px]">
          <span style={{ color: 'var(--color-dm-accent)' }}>$</span>
          <span
            className="inline-block overflow-hidden whitespace-nowrap text-dm-ink"
            style={{
              borderRight: '1.5px solid var(--color-dm-accent)',
              paddingRight: '2px',
              width: '0',
              animation: `dm-type ${TYPE_DURATION_MS}ms steps(${TYPE_CMD.length}, end) forwards, dm-caret 900ms steps(1) infinite`,
              // `ch` keeps the reveal aligned to monospace glyph advances
              ['--dm-type-chars' as string]: `${TYPE_CMD.length}ch`
            }}
          >
            {TYPE_CMD}
          </span>
        </div>

        <StageLine delayMs={STAGE_STEPS.tap}>
          <span className="text-dm-ink-3">==&gt;</span> Tapping{' '}
          <span className="text-dm-ink">zingerlittlebee/tap</span>
        </StageLine>

        <StageLine delayMs={STAGE_STEPS.fetch}>
          <span className="text-dm-ink-3">==&gt;</span> Downloading{' '}
          <span className="text-dm-ink">Dockerman</span>{' '}
          <span className="text-dm-ink-4">v5.1.0</span>
        </StageLine>

        {/* progress */}
        <StageLine className="mt-[2px]" delayMs={STAGE_STEPS.progress}>
          <span className="inline-flex items-center gap-[10px]">
            <span
              className="relative block h-[6px] w-[200px] overflow-hidden rounded-full"
              style={{ background: 'var(--color-dm-bg-soft)' }}
            >
              <span
                className="absolute inset-y-0 left-0 block rounded-full"
                style={{
                  width: '0',
                  background:
                    'linear-gradient(90deg, var(--color-dm-accent), var(--color-dm-accent-2))',
                  animation: 'dm-progress 1200ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  animationDelay: `${STAGE_STEPS.progress}ms`,
                  ['--dm-progress' as string]: '100%'
                }}
              />
            </span>
            <span className="font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-3">
              28.4 / 28.4 MB
            </span>
          </span>
        </StageLine>

        {/* done */}
        <StageLine delayMs={STAGE_STEPS.done}>
          <span style={{ color: 'var(--color-dm-ok)' }}>✓</span>{' '}
          <span className="text-dm-ink">Installed</span>{' '}
          <span className="text-dm-ink-4">in 2.1s</span>
          <span className="ml-2 text-dm-ink-4">· launching Dockerman…</span>
        </StageLine>
      </div>
    </div>
  )
}

function StageLine({
  delayMs,
  children,
  className = ''
}: {
  delayMs: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        opacity: 0,
        animation: 'dm-reveal-up 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        animationDelay: `${delayMs}ms`
      }}
    >
      {children}
    </div>
  )
}

function ContainerMini({
  name,
  img,
  cpu,
  mem,
  delayMs
}: {
  name: string
  img: string
  cpu: string
  mem: string
  delayMs: number
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[10px] border border-dm-line bg-dm-bg-elev px-[14px] py-[10px]"
      style={{
        opacity: 0,
        animation: 'dm-reveal-up 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        animationDelay: `${delayMs}ms`
      }}
    >
      <span
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{
          background: 'var(--color-dm-ok)',
          boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-dm-ok) 28%, transparent)',
          animation: 'dm-pulse 2.2s ease-in-out infinite'
        }}
      />
      <span className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="truncate font-semibold text-[13px] text-dm-ink">{name}</span>
        <span className="truncate font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4">{img}</span>
      </span>
      <MiniBars delayMs={delayMs + 200} />
      <span className="font-[var(--font-dm-mono)] text-[11px] text-dm-ink-3 tabular-nums">
        {cpu}
      </span>
      <span className="font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4 tabular-nums">
        {mem}
      </span>
    </div>
  )
}

const MINI_BARS = [
  { id: 'a', h: 0.55 },
  { id: 'b', h: 0.8 },
  { id: 'c', h: 0.45 },
  { id: 'd', h: 0.92 },
  { id: 'e', h: 0.6 },
  { id: 'f', h: 0.78 },
  { id: 'g', h: 0.5 }
] as const

function MiniBars({ delayMs }: { delayMs: number }) {
  return (
    <span className="flex h-[14px] items-end gap-[2px]">
      {MINI_BARS.map((bar, i) => (
        <span
          className="block w-[2px] origin-bottom rounded-[1px]"
          key={bar.id}
          style={{
            height: `${bar.h * 100}%`,
            background: 'var(--color-dm-accent)',
            opacity: 0.7,
            animation: `dm-spark 1800ms ease-in-out ${delayMs + i * 90}ms infinite`
          }}
        />
      ))}
    </span>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent italic"
      style={{
        fontFamily: 'var(--font-dm-display)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        backgroundImage:
          'linear-gradient(135deg, var(--color-dm-accent) 0%, var(--color-dm-accent-2) 100%)',
        // The heading uses leading-[0.95] + background-clip:text. Italic
        // glyphs overshoot their advance width (l, y) and extend beyond
        // the tight line box (y descender). Extending padding on both
        // axes grows the gradient's paint area to cover those pixels;
        // matching negative margins keep surrounding text (. and the
        // next line) in place.
        paddingInlineEnd: '0.18em',
        marginInlineEnd: '-0.18em',
        paddingBlockEnd: '0.18em',
        marginBlockEnd: '-0.18em'
      }}
    >
      {children}
    </span>
  )
}
