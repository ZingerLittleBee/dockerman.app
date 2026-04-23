'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SNAPSHOT_MODULES } from '@/config/snapshot'
import { ModuleIcon } from './ModuleIcon'

const TOTAL = SNAPSHOT_MODULES.length

export function SnapshotShowcase() {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const railRef = useRef<HTMLElement | null>(null)
  const mobRef = useRef<HTMLDivElement | null>(null)

  const go = useCallback((next: number) => {
    const n = ((next % TOTAL) + TOTAL) % TOTAL
    setActive((cur) => {
      setPrev(cur)
      return n
    })
  }, [])

  // Deep-link on load.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const idx = SNAPSHOT_MODULES.findIndex((m) => m.key === hash)
    if (idx >= 0) go(idx)
  }, [go])

  // Keep the active item visible inside rail/mob-tabs.
  useEffect(() => {
    const nav = railRef.current
    if (nav && window.innerWidth > 1080) {
      const link = nav.querySelector<HTMLButtonElement>(`button[data-i="${active}"]`)
      if (link) {
        const linkTop = link.offsetTop
        const linkBottom = linkTop + link.offsetHeight
        const viewTop = nav.scrollTop
        const viewBottom = viewTop + nav.clientHeight
        const margin = 24
        if (linkTop < viewTop + margin) {
          nav.scrollTo({ top: Math.max(0, linkTop - margin), behavior: 'smooth' })
        } else if (linkBottom > viewBottom - margin) {
          nav.scrollTo({ top: linkBottom - nav.clientHeight + margin, behavior: 'smooth' })
        }
      }
    }
    const mob = mobRef.current
    if (mob) {
      const chip = mob.querySelector<HTMLButtonElement>(`button[data-i="${active}"]`)
      chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [active])

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(false)
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault()
        go(active + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault()
        go(active - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, go, lightbox])

  const current = SNAPSHOT_MODULES[active]
  const n = String(active + 1).padStart(2, '0')

  return (
    <section className="px-8 pt-12 pb-20">
      <div className="mx-auto max-w-[1320px]">
        {/* Mobile tab rail */}
        <div
          aria-label="Module tabs"
          className="-mx-8 mb-5 flex gap-2 overflow-x-auto px-8 pb-4 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          ref={mobRef}
          role="tablist"
        >
          {SNAPSHOT_MODULES.map((m, i) => (
            <button
              aria-label={`Show ${m.label}`}
              className={`flex shrink-0 items-center gap-[7px] rounded-full border px-3 py-[8px] font-medium text-[13px] transition-colors ${
                i === active
                  ? 'border-dm-ink bg-dm-ink text-dm-bg'
                  : 'border-dm-line-strong bg-dm-bg-elev text-dm-ink-3'
              }`}
              data-i={i}
              key={m.key}
              onClick={() => go(i)}
              type="button"
            >
              <ModuleIcon className="h-[14px] w-[14px]" icon={m.icon} />
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[280px_minmax(0,1fr)]">
          {/* Rail */}
          <aside
            aria-label="Module navigation"
            className="sticky top-[84px] hidden max-h-[calc(100vh-110px)] flex-col gap-[2px] overflow-y-auto pr-[10px] [scrollbar-color:var(--color-dm-line-strong)_transparent] [scrollbar-width:thin] md:flex"
            ref={railRef}
          >
            <div className="px-3 pb-[10px] font-[var(--font-dm-mono)] font-semibold text-[10.5px] text-dm-ink-4 uppercase tracking-[0.1em]">
              All modules
            </div>
            {SNAPSHOT_MODULES.map((m, i) => (
              <RailItem
                active={i === active}
                icon={m.icon}
                index={i}
                key={m.key}
                label={m.label}
                onSelect={() => go(i)}
              />
            ))}
          </aside>

          {/* Viewer */}
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-[16px] border border-dm-line-strong bg-dm-bg-elev"
              style={{ boxShadow: '0 20px 40px -20px rgb(0 0 0 / 0.35)' }}
            >
              <ViewerTopbar
                active={active}
                label={current.label}
                onNext={() => go(active + 1)}
                onPrev={() => go(active - 1)}
                onZoom={() => setLightbox(true)}
                pager={n}
              />
              <Stage active={active} onZoom={() => setLightbox(true)} prev={prev} />
            </div>

            <CaptionStrip
              descHtml={current.desc}
              em={current.em}
              label={current.label}
              onCopyLink={() => {
                const url = `${window.location.href.split('#')[0]}#${current.key}`
                navigator.clipboard?.writeText(url).catch(() => undefined)
              }}
            />
          </div>
        </div>
      </div>

      {lightbox && <Lightbox active={active} onClose={() => setLightbox(false)} />}
    </section>
  )
}

function RailItem({
  active,
  index,
  label,
  icon,
  onSelect
}: {
  active: boolean
  index: number
  label: string
  icon: (typeof SNAPSHOT_MODULES)[number]['icon']
  onSelect: () => void
}) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <button
      aria-current={active ? 'true' : undefined}
      className={`grid w-full cursor-pointer grid-cols-[28px_1fr_auto] items-center gap-3 rounded-[8px] border px-3 py-[10px] text-left font-[inherit] text-[13.5px] transition-colors ${
        active
          ? 'border-dm-line-strong bg-dm-bg-elev text-dm-ink'
          : 'border-transparent text-dm-ink-3 hover:bg-dm-bg-soft hover:text-dm-ink-2'
      }`}
      data-i={index}
      onClick={onSelect}
      type="button"
    >
      <span
        className={`grid h-[28px] w-[28px] place-items-center rounded-[7px] border transition-colors ${
          active ? 'border-transparent text-white' : 'border-dm-line bg-dm-bg-soft text-dm-ink-3'
        }`}
        style={
          active
            ? {
                background:
                  'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
                boxShadow:
                  '0 3px 10px -3px color-mix(in srgb, var(--color-dm-accent) 55%, transparent)'
              }
            : undefined
        }
      >
        <ModuleIcon icon={icon} />
      </span>
      <span className="font-medium tracking-[-0.005em]">{label}</span>
      <span
        className={`min-w-[22px] text-right font-[var(--font-dm-mono)] font-semibold text-[10.5px] ${
          active ? 'text-dm-accent' : 'text-dm-ink-4'
        }`}
        style={active ? { color: 'var(--color-dm-accent)' } : undefined}
      >
        {num}
      </span>
    </button>
  )
}

function ViewerTopbar({
  active,
  label,
  onNext,
  onPrev,
  onZoom,
  pager
}: {
  active: number
  label: string
  onNext: () => void
  onPrev: () => void
  onZoom: () => void
  pager: string
}) {
  return (
    <div
      className="flex items-center gap-[14px] border-dm-line border-b px-4 py-3"
      style={{
        background: 'color-mix(in srgb, var(--color-dm-bg-soft) 60%, var(--color-dm-bg-elev))'
      }}
    >
      <div className="flex gap-[6px]">
        <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
      </div>
      <div className="flex items-center gap-2 font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-3">
        <span>Dockerman</span>
        <span className="text-dm-ink-4">/</span>
        <span className="font-semibold text-dm-ink">{label}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="rounded-[5px] border border-dm-line bg-dm-bg-soft px-[10px] py-1 font-[var(--font-dm-mono)] text-[11px] text-dm-ink-3">
          <span className="font-semibold text-dm-ink">{pager}</span> / {TOTAL}
        </span>
        <TopbarBtn ariaLabel="Previous" onClick={onPrev}>
          <path d="M15 18l-6-6 6-6" />
        </TopbarBtn>
        <TopbarBtn ariaLabel="Next" onClick={onNext}>
          <path d="M9 18l6-6-6-6" />
        </TopbarBtn>
        <TopbarBtn ariaLabel="Zoom" onClick={onZoom}>
          <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
        </TopbarBtn>
      </div>
      {/* keep active reference for focus management (unused visually) */}
      <span className="sr-only">{active}</span>
    </div>
  )
}

function TopbarBtn({
  ariaLabel,
  children,
  onClick
}: {
  ariaLabel: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="grid h-[28px] w-[28px] cursor-pointer place-items-center rounded-[6px] border border-dm-line bg-dm-bg-soft text-dm-ink-3 transition-colors hover:border-dm-line-strong hover:bg-dm-bg-elev hover:text-dm-ink"
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-[14px] w-[14px]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </button>
  )
}

function Stage({ active, onZoom, prev }: { active: number; onZoom: () => void; prev: number }) {
  return (
    <button
      aria-label="Open in lightbox"
      className="relative block w-full cursor-zoom-in overflow-hidden bg-dm-bg-soft"
      onClick={onZoom}
      style={{ aspectRatio: '2400 / 1600' }}
      type="button"
    >
      <StageBadge active={active} />
      {SNAPSHOT_MODULES.map((m, i) => {
        const isActive = i === active
        const isPrev = i === prev && prev !== active
        return <Slide active={isActive} alt={m.label} key={m.key} prev={isPrev} src={m.src} />
      })}
    </button>
  )
}

function Slide({
  active,
  alt,
  prev,
  src
}: {
  active: boolean
  alt: string
  prev: boolean
  src: string | null
}) {
  const visible = active || prev
  const style: React.CSSProperties = {
    transition:
      'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), clip-path 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
    opacity: visible ? 1 : 0,
    clipPath: active ? 'inset(0 0 0 0)' : prev ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
    zIndex: active ? 2 : prev ? 1 : 0
  }
  if (src) {
    return (
      <Image
        alt={alt}
        aria-hidden={!active}
        className="absolute inset-0 h-full w-full object-cover object-[center_top]"
        fill
        priority={active}
        sizes="(max-width: 1080px) 100vw, 960px"
        src={src}
        style={style}
      />
    )
  }
  return (
    <div
      aria-hidden={!active}
      className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] p-10 text-center font-[var(--font-dm-mono)] text-[13px] text-dm-ink-4"
      style={{
        ...style,
        backgroundImage:
          'repeating-linear-gradient(135deg, var(--color-dm-bg-elev) 0 12px, var(--color-dm-bg-soft) 12px 24px)'
      }}
    >
      <div className="grid h-[56px] w-[56px] place-items-center rounded-[14px] border border-dm-line-strong bg-dm-bg-elev text-dm-ink-3">
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div>
        <div className="font-[var(--font-sans)] font-semibold text-[15px] text-dm-ink-2 tracking-[-0.01em]">
          {alt}
        </div>
        <div className="mx-auto mt-1 max-w-[36ch] text-dm-ink-4 leading-[1.5]">
          Screenshot not bundled — see the live app for a full walkthrough.
        </div>
      </div>
    </div>
  )
}

function StageBadge({ active }: { active: number }) {
  const m = SNAPSHOT_MODULES[active]
  const n = String(active + 1).padStart(2, '0')
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-5 left-5 z-[3] flex items-center gap-[10px] rounded-full border border-dm-line-strong py-[9px] pr-[14px] pl-[9px] font-semibold text-[13px] text-dm-ink tracking-[-0.005em] backdrop-blur-[10px]"
      style={{
        background: 'color-mix(in srgb, var(--color-dm-bg-elev) 88%, transparent)',
        boxShadow: '0 6px 18px -8px rgb(0 0 0 / 0.3)'
      }}
    >
      <span
        className="grid h-[26px] w-[26px] place-items-center rounded-full text-white"
        style={{
          background: 'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))'
        }}
      >
        <ModuleIcon className="h-[14px] w-[14px]" icon={m.icon} />
      </span>
      <span>{m.label}</span>
      <span className="ml-1 border-dm-line border-l pl-[10px] font-[var(--font-dm-mono)] font-medium text-[10.5px] text-dm-ink-4">
        {n} / {TOTAL}
      </span>
    </span>
  )
}

function CaptionStrip({
  em,
  onCopyLink,
  descHtml,
  label
}: {
  em: string
  onCopyLink: () => void
  descHtml: string
  label: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="mt-6 grid grid-cols-1 items-center gap-6 rounded-[14px] border border-dm-line bg-dm-bg-elev px-[26px] py-[22px] md:grid-cols-[1fr_auto]">
      <div>
        <h3 className="m-0 font-bold text-[22px] text-dm-ink tracking-[-0.022em]">
          {label} —{' '}
          <em
            className="font-[var(--font-dm-display)] font-normal italic"
            style={{ color: 'var(--color-dm-accent)' }}
          >
            {em}
          </em>
        </h3>
        <p
          className="m-0 mt-1 max-w-[70ch] text-[14px] text-dm-ink-3 leading-[1.55] [&_code]:rounded [&_code]:bg-dm-bg-soft [&_code]:px-[5px] [&_code]:py-[1px] [&_code]:font-[var(--font-dm-mono)] [&_code]:text-[13px]"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: copy is authored by us in config/snapshot.ts and only contains <code> tags.
          dangerouslySetInnerHTML={{ __html: descHtml }}
        />
      </div>
      <div className="flex gap-2">
        <a
          className="inline-flex cursor-pointer items-center gap-[7px] rounded-[8px] border border-dm-line bg-dm-bg-soft px-3 py-[7px] font-medium text-[12.5px] text-dm-ink-2 transition-colors hover:border-dm-line-strong hover:bg-dm-bg-elev hover:text-dm-ink"
          href="/docs"
        >
          <svg
            aria-hidden="true"
            className="h-[14px] w-[14px]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M4 4h12l4 4v12H4z" />
            <path d="M16 4v4h4" />
            <path d="M8 12h8M8 16h8" />
          </svg>
          Docs
        </a>
        <button
          className="inline-flex cursor-pointer items-center gap-[7px] rounded-[8px] border border-dm-line bg-dm-bg-soft px-3 py-[7px] font-medium text-[12.5px] text-dm-ink-2 transition-colors hover:border-dm-line-strong hover:bg-dm-bg-elev hover:text-dm-ink"
          onClick={() => {
            onCopyLink()
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-[14px] w-[14px]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M10 6h9a1 1 0 0 1 1 1v11M6 10h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
          </svg>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}

function Lightbox({ active, onClose }: { active: number; onClose: () => void }) {
  const m = SNAPSHOT_MODULES[active]
  const n = String(active + 1).padStart(2, '0')
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center p-10"
      onClick={onClose}
      role="dialog"
      style={{ background: 'rgb(0 0 0 / 0.92)' }}
    >
      <button
        aria-label="Close"
        className="absolute top-5 right-5 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 text-white"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        style={{ background: 'rgb(255 255 255 / 0.1)' }}
        type="button"
      >
        <svg
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2.2}
          viewBox="0 0 24 24"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      {m.src ? (
        <Image
          alt={m.label}
          className="block max-h-[86vh] max-w-[94vw] rounded-[10px] bg-dm-bg-soft object-contain"
          height={1600}
          onClick={(e) => e.stopPropagation()}
          priority
          sizes="94vw"
          src={m.src}
          style={{ boxShadow: '0 30px 60px -20px rgb(0 0 0 / 0.6)', width: 'auto', height: 'auto' }}
          width={2400}
        />
      ) : (
        <div
          className="flex h-[50vh] w-[70vw] flex-col items-center justify-center gap-4 rounded-[10px] bg-dm-bg-soft p-10 text-center text-dm-ink-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-[var(--font-sans)] font-semibold text-[18px]">{m.label}</div>
          <div className="text-dm-ink-4">Screenshot not bundled in this preview.</div>
        </div>
      )}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 font-[var(--font-dm-mono)] text-[13px] text-white backdrop-blur-[10px]"
        style={{ background: 'rgb(0 0 0 / 0.5)' }}
      >
        {n} · {m.label}
      </div>
    </div>
  )
}
