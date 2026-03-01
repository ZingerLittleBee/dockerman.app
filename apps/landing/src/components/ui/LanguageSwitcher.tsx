'use client'

import { usePathname, useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useEffect, useRef, useState } from 'react'
import { cookieName, type Locale, locales } from '@repo/shared/i18n'

const languageNames: Record<Locale, string> = {
  en: 'EN',
  zh: '中'
}

const languageFullNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文'
}

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

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Switch language"
        className="flex size-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-sm">{languageNames[currentLocale]}</span>
      </button>
      {open && (
        <div className="absolute top-12 right-0 z-50 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {locales.map((locale) => (
            <button
              className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                locale === currentLocale
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              key={locale}
              onClick={() => switchLocale(locale)}
            >
              {languageFullNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
