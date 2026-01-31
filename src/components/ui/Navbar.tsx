'use client'

import { RiCloseLine, RiMenuLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import posthog from 'posthog-js'
import React, { useEffect, useState } from 'react'
import { useLocale, useTranslation } from '@/lib/i18n/client'
import useScroll from '@/lib/use-scroll'
import { cx } from '@/lib/utils'
import { Logo } from '../../../public/logo'
import { Button } from '../Button'
import { LanguageSwitcher } from './LanguageSwitcher'

function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-10" />
  }

  const isDark = resolvedTheme === 'dark'

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = isDark ? 'light' : 'dark'

    // Track theme change
    posthog.capture('theme_changed', {
      from_theme: resolvedTheme,
      to_theme: newTheme,
      location: 'navbar'
    })

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    // Get the click position for the animation origin
    const x = event.clientX
    const y = event.clientY
    // Calculate the maximum radius needed to cover the entire screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Set CSS custom properties for the animation
    document.documentElement.style.setProperty('--x', `${x}px`)
    document.documentElement.style.setProperty('--y', `${y}px`)
    document.documentElement.style.setProperty('--r', `${endRadius}px`)
    // Add timestamp to force GIF to restart from beginning
    document.documentElement.style.setProperty(
      '--transition-mask',
      `url('/images/i-love-you-love.gif?t=${Date.now()}')`
    )

    // Start the view transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    // Apply circular expand animation on the new view
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        },
        {
          duration: 400,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex size-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      onClick={handleThemeToggle}
    >
      {isDark ? <RiSunLine className="size-5" /> : <RiMoonLine className="size-5" />}
    </button>
  )
}

export function Navigation() {
  const scrolled = useScroll(15)
  const [open, setOpen] = React.useState(false)
  const locale = useLocale()
  const { t } = useTranslation()

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia('(min-width: 768px)')
    const handleMediaQueryChange = () => {
      setOpen(false)
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange)
    handleMediaQueryChange()

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  return (
    <header
      className={cx(
        'fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu animate-slide-down-fade justify-center rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform',
        open === true ? 'h-52' : 'h-16',
        scrolled || open === true
          ? 'max-w-3xl border-gray-100 bg-white/80 shadow-black/5 shadow-xl backdrop-blur-nav dark:border-white/15 dark:bg-black/70'
          : 'bg-white/0 dark:bg-gray-950/0'
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link aria-label="Home" href={`/${locale}`}>
            <span className="sr-only">Dockerman</span>
            <Logo />
          </Link>
          <nav className="hidden md:absolute md:top-1/2 md:left-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={`/${locale}`}
                onClick={() => {
                  posthog.capture('nav_link_clicked', {
                    link_text: t('nav.home'),
                    link_url: `/${locale}`,
                    location: 'navbar_desktop'
                  })
                }}
              >
                {t('nav.home')}
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={`/${locale}/download`}
                onClick={() => {
                  posthog.capture('nav_link_clicked', {
                    link_text: t('nav.download'),
                    link_url: `/${locale}/download`,
                    location: 'navbar_desktop'
                  })
                }}
              >
                {t('nav.download')}
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={`/${locale}/changelog`}
                onClick={() => {
                  posthog.capture('nav_link_clicked', {
                    link_text: t('nav.changelog'),
                    link_url: `/${locale}/changelog`,
                    location: 'navbar_desktop'
                  })
                }}
              >
                {t('nav.changelog')}
              </Link>
            </div>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggleButton />
            <a
              href={`/${locale}/download`}
              onClick={() => {
                posthog.capture('navbar_download_clicked', {
                  button_text: 'Download',
                  location: 'navbar_desktop'
                })
              }}
            >
              <Button className="h-10 font-semibold">{t('common.download')}</Button>
            </a>
          </div>

          <div className="flex gap-x-2 md:hidden">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggleButton />
            <a
              href={`/${locale}/download`}
              onClick={() => {
                posthog.capture('navbar_download_clicked', {
                  button_text: 'Download',
                  location: 'navbar_mobile'
                })
              }}
            >
              <Button>{t('common.download')}</Button>
            </a>
            <Button className="aspect-square p-2" onClick={() => setOpen(!open)} variant="light">
              {open ? (
                <RiCloseLine aria-hidden="true" className="size-5" />
              ) : (
                <RiMenuLine aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          className={cx(
            'my-6 flex text-lg ease-in-out will-change-transform md:hidden',
            open ? '' : 'hidden'
          )}
        >
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <a
                href={`/${locale}`}
                onClick={() => {
                  posthog.capture('nav_link_clicked', {
                    link_text: t('nav.home'),
                    link_url: `/${locale}`,
                    location: 'navbar_mobile'
                  })
                }}
              >
                {t('nav.home')}
              </a>
            </li>

            <li onClick={() => setOpen(false)}>
              <a
                href={`/${locale}/download`}
                onClick={() => {
                  posthog.capture('nav_link_clicked', {
                    link_text: t('nav.download'),
                    link_url: `/${locale}/download`,
                    location: 'navbar_mobile'
                  })
                }}
              >
                {t('nav.download')}
              </a>
            </li>

            <li onClick={() => setOpen(false)}>
              <Link
                href={`/${locale}/changelog`}
                onClick={() => {
                  posthog.capture('nav_link_clicked', {
                    link_text: t('nav.changelog'),
                    link_url: `/${locale}/changelog`,
                    location: 'navbar_mobile'
                  })
                }}
              >
                {t('nav.changelog')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
