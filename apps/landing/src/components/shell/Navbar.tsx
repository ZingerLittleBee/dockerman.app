'use client'

import { RiGithubFill } from '@remixicon/react'
import type { Locale } from '@repo/shared/i18n'
import { useTranslation } from '@repo/shared/i18n/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/app/siteConfig'
import { LocaleSwitch } from '@/components/shell/LocaleSwitch'
import ThemeSwitch from '@/components/ThemeSwitch'

const LINKS: { href: string; labelKey: string; anchor?: boolean }[] = [
  { href: '/#features', labelKey: 'nav.features', anchor: true },
  { href: '/snapshot', labelKey: 'nav.snapshot' },
  { href: '/pricing', labelKey: 'nav.pricing' },
  { href: '/changelog', labelKey: 'nav.changelog' },
  { href: '/docs', labelKey: 'nav.docs' }
]

export function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const { t } = useTranslation(locale)
  const [menuOpen, setMenuOpen] = useState(false)

  const hrefFor = (href: string) => `/${locale}${href === '/' ? '' : href}`

  const isActive = (href: string, anchor?: boolean) => {
    if (anchor) return false
    const full = hrefFor(href)
    if (href === '/') {
      return pathname === full || pathname === `/${locale}`
    }
    return pathname.startsWith(full)
  }

  // Close on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll while menu open
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <nav
      className="sticky top-0 z-50 border-dm-line border-b backdrop-blur-[14px]"
      style={{
        background: 'color-mix(in srgb, var(--color-dm-bg) 80%, transparent)'
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-2 px-4 py-[14px] sm:px-6 md:px-8">
        <Link
          className="flex min-w-0 items-center gap-[10px] font-bold text-[15px] text-dm-ink tracking-[-0.01em]"
          href={hrefFor('/')}
        >
          <BrandMark />
          <span>Dockerman</span>
          <span className="ml-[2px] hidden rounded-full bg-dm-ink px-2 py-[2px] font-semibold text-[10px] text-dm-bg tracking-[0.04em] sm:inline">
            v{siteConfig.latestVersion}
          </span>
        </Link>

        <div className="hidden items-center gap-1 text-[13px] text-dm-ink-2 md:flex">
          {LINKS.map((l) => (
            <Link
              className={`rounded-md px-3 py-[6px] transition-colors hover:bg-dm-bg-soft hover:text-dm-ink ${
                isActive(l.href, l.anchor) ? 'text-dm-ink' : ''
              }`}
              href={hrefFor(l.href)}
              key={l.href}
            >
              {t(l.labelKey)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleSwitch locale={locale} />
          <ThemeSwitch />
          <a
            aria-label={t('nav.github')}
            className="hidden h-8 w-8 place-items-center rounded-md text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink sm:grid"
            href="https://github.com/ZingerLittleBee/dockerman.app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <RiGithubFill className="h-4 w-4" />
          </a>
          <Link
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-dm-ink bg-dm-ink px-[12px] py-[7px] font-medium text-[12.5px] text-dm-bg transition-transform hover:-translate-y-px sm:px-[14px] sm:py-2 sm:text-[13px]"
            href={hrefFor('/download')}
          >
            {t('nav.download')}
          </Link>
          <button
            aria-controls="dm-mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-dm-line bg-dm-bg-elev text-dm-ink-2 transition-colors hover:border-dm-line-strong hover:text-dm-ink md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        aria-hidden={!menuOpen}
        className={`md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Backdrop */}
        <button
          aria-label={t('nav.closeMenu')}
          className={`fixed inset-x-0 top-[57px] bottom-0 z-40 cursor-default bg-dm-bg/60 backdrop-blur-[2px] transition-opacity duration-200 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
          type="button"
        />
        {/* Panel */}
        <div
          className={`absolute inset-x-0 top-full z-50 origin-top border-dm-line border-b bg-dm-bg shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)] transition-all duration-200 ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
          id="dm-mobile-menu"
        >
          <ul className="mx-auto flex max-w-[1240px] flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => {
              const active = isActive(l.href, l.anchor)
              return (
                <li key={l.href}>
                  <Link
                    className={`flex items-center justify-between rounded-md px-3 py-3 text-[15px] transition-colors ${
                      active
                        ? 'bg-dm-bg-soft text-dm-ink'
                        : 'text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink'
                    }`}
                    href={hrefFor(l.href)}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{t(l.labelKey)}</span>
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 text-dm-ink-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              )
            })}
            <li className="mt-2 border-dm-line border-t pt-3">
              <a
                className="flex items-center gap-3 rounded-md px-3 py-3 text-[14px] text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink"
                href="https://github.com/ZingerLittleBee/dockerman.app"
                onClick={() => setMenuOpen(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <RiGithubFill className="h-[18px] w-[18px]" />
                <span>{t('nav.github')}</span>
              </a>
            </li>
          </ul>
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
        background: 'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
        boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 4px 12px -4px var(--color-dm-accent)'
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
