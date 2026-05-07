'use client'

import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { applyThemeWithTransition } from '@/lib/theme-transition'

export function DocsThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const value = mounted ? resolvedTheme : null
  const isLight = value === 'light'
  const next = isLight ? 'dark' : 'light'

  return (
    <button
      aria-label="Toggle theme"
      className={[
        'ms-auto inline-flex items-center rounded-full border p-0 *:rounded-full *:size-6.5 *:p-1.5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-theme-toggle=""
      onClick={() => applyThemeWithTransition(() => setTheme(next))}
      type="button"
    >
      <span
        className={
          isLight
            ? 'bg-fd-accent text-fd-accent-foreground'
            : 'text-fd-muted-foreground'
        }
      >
        <RiSunLine className="size-full" />
      </span>
      <span
        className={
          value === 'dark'
            ? 'bg-fd-accent text-fd-accent-foreground'
            : 'text-fd-muted-foreground'
        }
      >
        <RiMoonLine className="size-full" />
      </span>
    </button>
  )
}
