'use client'

import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'
import { useState } from 'react'

const INSTALL_CMD = 'brew install --cask dockerman'

export function Hero({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false)

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
    <section className="relative px-8 pt-16 pb-8">
      <div
        aria-hidden
        className="-translate-x-1/2 -z-[1] pointer-events-none absolute top-0 left-1/2 h-[500px] w-[900px] blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent) 25%, transparent), transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-[1240px]">
        {/* Eyebrow: pulsing dot + version note + NEW tag */}
        <span
          className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev py-[5px] pr-[10px] pl-[6px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2"
        >
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
              animation: 'dm-pulse 2.2s ease-in-out infinite',
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
          Boots in ~0ms, lives in under 30 MB of memory, never phones home.
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
              boxShadow: '0 10px 30px -10px color-mix(in srgb, var(--color-dm-accent-2) 60%, transparent)',
            }}
          >
            <svg
              aria-hidden="true"
              fill="currentColor"
              height="14"
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4v-2h14v2H5z" />
            </svg>
            Download for macOS
            <span
              className="inline-flex items-center gap-[6px] rounded-md px-[10px] py-1 font-[var(--font-dm-mono)] text-[11px]"
              style={{
                background: 'rgb(255 255 255 / 0.18)',
                opacity: 0.9,
              }}
            >
              ↓ 18MB
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
          <span>MIT licensed</span>
          <span className="h-[3px] w-[3px] rounded-full bg-dm-ink-4" />
          <span>v5.1.0 · Apr 8, 2026</span>
        </div>
      </div>
    </section>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text italic text-transparent"
      style={{
        fontFamily: 'var(--font-dm-display)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        backgroundImage:
          'linear-gradient(135deg, var(--color-dm-accent) 0%, var(--color-dm-accent-2) 100%)',
      }}
    >
      {children}
    </span>
  )
}
