'use client'

import { cookieName, type Locale, localeConfig, locales } from '@repo/shared/i18n'
import { usePathname, useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useEffect, useRef, useState } from 'react'

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    // Track locale change
    posthog.capture('locale_changed', {
      from_locale: currentLocale,
      to_locale: newLocale,
      location: 'navbar'
    })

    // Set cookie
    document.cookie = `${cookieName}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`

    // Replace locale in path
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    router.push(newPath)
    setOpen(false)
  }

  const currentConfig = localeConfig[currentLocale]

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Switch language"
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base">{currentConfig.flag}</span>
        <span className="hidden font-medium text-sm sm:inline">{currentConfig.name}</span>
      </button>
      {open && (
        <div className="absolute top-12 right-0 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {locales.map((locale) => (
            <button
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                locale === currentLocale
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              key={locale}
              onClick={() => switchLocale(locale)}
            >
              <span className="text-base">{localeConfig[locale].flag}</span>
              <span>{localeConfig[locale].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
