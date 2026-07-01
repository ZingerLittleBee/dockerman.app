'use client'

import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { applyThemeWithTransition } from '@/lib/theme-transition'

function subscribeHydrated(listener: () => void) {
  queueMicrotask(listener)
  return () => undefined
}

function getHydratedSnapshot() {
  return true
}

function getServerHydratedSnapshot() {
  return false
}

export function DocsThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = useSyncExternalStore(
    subscribeHydrated,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  )

  const value = hydrated ? resolvedTheme : null
  const isLight = value === 'light'
  const next = isLight ? 'dark' : 'light'

  return (
    <button
      aria-label="Toggle theme"
      className={[
        'ms-auto inline-flex items-center rounded-full border p-0 *:size-6.5 *:rounded-full *:p-1.5',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      data-theme-toggle=""
      onClick={() => applyThemeWithTransition(() => setTheme(next))}
      type="button"
    >
      <span
        className={isLight ? 'bg-fd-accent text-fd-accent-foreground' : 'text-fd-muted-foreground'}
      >
        <RiSunLine className="size-full" />
      </span>
      <span
        className={
          value === 'dark' ? 'bg-fd-accent text-fd-accent-foreground' : 'text-fd-muted-foreground'
        }
      >
        <RiMoonLine className="size-full" />
      </span>
    </button>
  )
}
