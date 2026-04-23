'use client'

import type { Locale } from '@repo/shared/i18n'
import { RiGithubFill } from '@remixicon/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeSwitch from '@/components/ThemeSwitch'

// TODO(i18n): labels deferred per docs/superpowers/plans/2026-04-23-landing-redesign-plan.md — localize in Phase 6.
const LINKS = [
  { href: '/', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/download', label: 'Download' },
  { href: '/docs', label: 'Docs' },
  { href: '/changelog', label: 'Changelog' }
]

export function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname()

  const hrefFor = (href: string) => `/${locale}${href === '/' ? '' : href}`

  const isActive = (href: string) => {
    const full = hrefFor(href)
    if (href === '/') {
      return pathname === full || pathname === `/${locale}`
    }
    return pathname.startsWith(full)
  }

  return (
    <nav
      className="sticky top-0 z-50 border-dm-line border-b backdrop-blur-[14px]"
      style={{
        background: 'color-mix(in srgb, var(--color-dm-bg) 80%, transparent)'
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-[14px]">
        <Link
          className="flex items-center gap-[10px] font-bold text-[15px] text-dm-ink tracking-[-0.01em]"
          href={hrefFor('/')}
        >
          <BrandMark />
          <span>Dockerman</span>
        </Link>

        <div className="hidden items-center gap-1 text-[13px] text-dm-ink-2 md:flex">
          {LINKS.map((l) => (
            <Link
              className={`rounded-md px-3 py-[6px] transition-colors hover:bg-dm-bg-soft hover:text-dm-ink ${
                isActive(l.href) ? 'text-dm-ink' : ''
              }`}
              href={hrefFor(l.href)}
              key={l.href}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <a
            aria-label="GitHub"
            className="grid h-8 w-8 place-items-center rounded-md text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink"
            href="https://github.com/ZingerLittleBee/dockerman.app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <RiGithubFill className="h-4 w-4" />
          </a>
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-dm-ink bg-dm-ink px-[14px] py-2 font-medium text-[13px] text-dm-bg transition-transform hover:-translate-y-px"
            href={hrefFor('/download')}
          >
            Download
          </Link>
        </div>
      </div>
    </nav>
  )
}

function BrandMark() {
  return (
    <span
      className="relative grid h-[26px] w-[26px] place-items-center overflow-hidden rounded-[7px] text-white"
      style={{
        background:
          'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
        boxShadow:
          'inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 4px 12px -4px var(--color-dm-accent)'
      }}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M28,12H20V4h8Zm-6-2h4V6H22Z" />
        <path d="M17,15V9H9V23H23V15Zm-6-4h4v4H11Zm4,10H11V17h4Zm6,0H17V17h4Z" />
        <path d="M26,28H6a2,2,0,0,1-2-2V6A2,2,0,0,1,6,4H16V6H6V26H26V16h2V26A2,2,0,0,1,26,28Z" />
      </svg>
    </span>
  )
}
