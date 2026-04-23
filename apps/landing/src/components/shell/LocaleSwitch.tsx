'use client'

import { cookieName, type Locale, localeConfig, locales } from '@repo/shared/i18n'
import { useTranslation } from '@repo/shared/i18n/client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation(locale)

  useEffect(() => {
    if (!open) {
      return
    }
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const switchTo = (next: Locale) => {
    setOpen(false)
    if (next === locale) {
      return
    }
    document.cookie = `${cookieName}=${next}; path=/; max-age=31536000; samesite=lax`
    const parts = pathname.split('/')
    parts[1] = next
    router.push(parts.join('/') || `/${next}`)
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('nav.changeLanguage')}
        className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-dm-ink-2 transition-colors hover:bg-dm-bg-soft hover:text-dm-ink"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14.5 14.5 0 0 1 0 18" />
          <path d="M12 3a14.5 14.5 0 0 0 0 18" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute top-[40px] right-0 z-50 w-[168px] overflow-hidden rounded-[10px] border border-dm-line-strong bg-dm-bg-elev p-1"
          role="menu"
          style={{ boxShadow: '0 20px 40px -20px rgb(0 0 0 / 0.35)' }}
        >
          {locales.map((code) => {
            const isActive = code === locale
            return (
              <button
                aria-current={isActive ? 'true' : undefined}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-[10px] py-[7px] text-left text-[13px] transition-colors ${
                  isActive ? 'text-dm-ink' : 'text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink'
                }`}
                key={code}
                onClick={() => switchTo(code)}
                role="menuitem"
                type="button"
              >
                <span>{localeConfig[code].name}</span>
                {isActive ? (
                  <svg
                    aria-hidden="true"
                    className="h-[12px] w-[12px]"
                    fill="none"
                    stroke="var(--color-dm-accent)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
