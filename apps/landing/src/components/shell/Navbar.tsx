'use client'

import { RiGithubFill } from '@remixicon/react'
import type { Locale } from '@repo/shared/i18n'
import { useTranslation } from '@repo/shared/i18n/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrandMark } from '@/components/shell/BrandMark'
import { LocaleSwitch } from '@/components/shell/LocaleSwitch'
import ThemeSwitch from '@/components/ThemeSwitch'

const LINKS: { href: string; labelKey: string; anchor?: boolean }[] = [
  { href: '/#features', labelKey: 'nav.features', anchor: true },
  { href: '/snapshot', labelKey: 'nav.snapshot' },
  { href: '/vs-docker-desktop', labelKey: 'nav.compare' },
  { href: '/pricing', labelKey: 'nav.pricing' },
  { href: '/changelog', labelKey: 'nav.changelog' },
  { href: '/docs', labelKey: 'nav.docs' }
]

export function Navbar({
  locale,
  themeSwitch = true
}: {
  locale: Locale
  /** The home page is dark-only, so it hides the theme toggle. */
  themeSwitch?: boolean
}) {
  const pathname = usePathname()
  const { t } = useTranslation(locale)
  const [menu, setMenu] = useState({ open: false, pathname })
  const menuOpen = menu.open && menu.pathname === pathname

  const hrefFor = (href: string) => `/${locale}${href === '/' ? '' : href}`

  const isActive = (href: string, anchor?: boolean) => {
    if (anchor) return false
    const full = hrefFor(href)
    if (href === '/') {
      return pathname === full || pathname === `/${locale}`
    }
    return pathname.startsWith(full)
  }

  // Lock body scroll while menu open
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu({ open: false, pathname })
      }
    }
    document.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onEsc)
    }
  }, [menuOpen, pathname])

  return (
    <nav
      className="sticky top-0 z-50 border-dm-line border-b backdrop-blur-[14px]"
      style={{
        background: 'color-mix(in srgb, var(--color-dm-bg) 80%, transparent)'
      }}
    >
      <a className="dm-skip-link" href="#main">
        {t('nav.skipToContent')}
      </a>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-1.5 px-3 py-[14px] sm:gap-2 sm:px-6 md:px-8">
        <Link
          className="dm-focus-ring flex min-w-0 items-center rounded-md text-[15px] text-dm-ink"
          href={hrefFor('/')}
        >
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 text-[13px] text-dm-ink-2 md:flex">
          {LINKS.map((l) => (
            <Link
              className={`dm-focus-ring rounded-md px-3 py-[6px] transition-colors fine-hover:hover:bg-dm-bg-soft fine-hover:hover:text-dm-ink ${
                isActive(l.href, l.anchor) ? 'text-dm-ink' : ''
              }`}
              href={hrefFor(l.href)}
              key={l.href}
            >
              {t(l.labelKey)}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          <LocaleSwitch locale={locale} />
          {themeSwitch ? <ThemeSwitch /> : null}
          <a
            aria-label={t('nav.github')}
            className="dm-focus-ring hidden h-9 w-9 place-items-center rounded-md text-dm-ink-2 fine-hover:hover:bg-dm-bg-soft fine-hover:hover:text-dm-ink sm:grid"
            href="https://github.com/ZingerLittleBee/dockerman.app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <RiGithubFill className="h-4 w-4" />
          </a>
          <Link
            className="dm-focus-ring inline-flex h-9 shrink-0 items-center gap-[7px] whitespace-nowrap rounded-[10px] bg-dm-ink pr-[12px] pl-[10px] font-semibold text-[12.5px] text-dm-bg shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-dm-accent)_90%,transparent)] transition-[transform,box-shadow] duration-200 ease-out-strong fine-hover:hover:-translate-y-px fine-hover:hover:shadow-[0_12px_28px_-12px_var(--color-dm-accent)] active:translate-y-0 active:scale-[0.97] sm:pr-[14px] sm:pl-[12px] sm:text-[13px]"
            href={hrefFor('/download')}
          >
            <svg
              aria-hidden="true"
              className="h-[15px] w-[15px] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path d="M12 4v11" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 20h14" />
            </svg>
            {t('nav.download')}
          </Link>
          <button
            aria-controls="dm-mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="dm-focus-ring grid h-9 w-9 cursor-pointer place-items-center rounded-md border border-dm-line bg-dm-bg-elev text-dm-ink-2 transition-[color,background-color,border-color,transform] fine-hover:hover:border-dm-line-strong fine-hover:hover:text-dm-ink active:scale-[0.96] md:hidden"
            onClick={() =>
              setMenu((current) => ({
                open: current.pathname === pathname ? !current.open : true,
                pathname
              }))
            }
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
        className={`md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        inert={menuOpen ? undefined : true}
      >
        {/* Backdrop */}
        <button
          aria-label={t('nav.closeMenu')}
          className={`absolute inset-x-0 top-full z-40 h-[100dvh] cursor-default bg-dm-bg/60 backdrop-blur-[2px] transition-opacity duration-200 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenu({ open: false, pathname })}
          tabIndex={menuOpen ? 0 : -1}
          type="button"
        />
        {/* Panel */}
        <div
          className={`absolute inset-x-0 top-full z-50 origin-top border-dm-line border-b bg-dm-bg shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)] transition-[transform,opacity] duration-200 ease-out-strong ${
            menuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-2 opacity-0 motion-reduce:translate-y-0'
          }`}
          id="dm-mobile-menu"
        >
          <ul className="mx-auto flex max-w-[1240px] flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => {
              const active = isActive(l.href, l.anchor)
              return (
                <li key={l.href}>
                  <Link
                    className={`dm-focus-ring flex items-center justify-between rounded-md px-3 py-3 text-[15px] transition-colors ${
                      active
                        ? 'bg-dm-bg-soft text-dm-ink'
                        : 'text-dm-ink-2 fine-hover:hover:bg-dm-bg-soft fine-hover:hover:text-dm-ink'
                    }`}
                    href={hrefFor(l.href)}
                    onClick={() => setMenu({ open: false, pathname })}
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
                className="dm-focus-ring flex items-center gap-3 rounded-md px-3 py-3 text-[14px] text-dm-ink-2 fine-hover:hover:bg-dm-bg-soft fine-hover:hover:text-dm-ink"
                href="https://github.com/ZingerLittleBee/dockerman.app"
                onClick={() => setMenu({ open: false, pathname })}
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
