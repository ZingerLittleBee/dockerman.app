'use client'

import * as RadioGroupPrimitives from '@radix-ui/react-radio-group'
import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import type React from 'react'
import { useEffect, useState } from 'react'

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: RiSunLine },
  { value: 'dark', label: 'Dark', Icon: RiMoonLine },
] as const

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR / first paint we don't know the theme. Render a placeholder
  // matching the final footprint so the navbar doesn't reflow when the
  // client mounts.
  const active = mounted ? (theme === 'dark' || theme === 'light' ? theme : resolvedTheme) : null

  const onChange = (value: string) => {
    const fromTheme = theme
    setTheme(value)
    import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.capture('footer_theme_changed', {
          from_theme: fromTheme,
          to_theme: value,
          location: 'navbar',
        })
      })
      .catch(() => {
        /* analytics failures shouldn't block theme changes */
      })
  }

  return (
    <RadioGroupPrimitives.Root
      aria-label="Toggle color theme"
      className="inline-flex h-8 items-center gap-[2px] rounded-full border border-dm-line bg-dm-bg-elev p-[2px]"
      onValueChange={onChange}
      value={active ?? undefined}
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <RadioGroupPrimitives.Item
          aria-label={`Switch to ${label} mode`}
          className="group relative grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-full text-dm-ink-3 outline-none transition-colors hover:text-dm-ink data-[state=checked]:text-dm-ink focus-visible:ring-2 focus-visible:ring-[var(--color-dm-accent-2)]/60"
          key={value}
          value={value}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-data-[state=checked]:opacity-100"
            style={{
              background: 'var(--color-dm-bg)',
              boxShadow:
                'inset 0 0 0 1px var(--color-dm-line-strong), 0 4px 10px -6px color-mix(in srgb, var(--color-dm-accent-2) 40%, transparent)',
            }}
          />
          <Icon aria-hidden="true" className="relative z-10 h-[14px] w-[14px]" />
        </RadioGroupPrimitives.Item>
      ))}
    </RadioGroupPrimitives.Root>
  )
}

export default ThemeSwitch

// Re-export legacy sub-components in case other callers import them.
// They're intentionally no-ops that proxy to Radix primitives with
// minimal styling; update imports to the new default export when
// possible.
export const RadioGroup = RadioGroupPrimitives.Root
export const RadioGroupItem: React.FC<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item> & { icon?: React.ElementType }
> = ({ icon: Icon, ...props }) => (
  <RadioGroupPrimitives.Item {...props}>
    {Icon ? <Icon className="h-4 w-4" /> : null}
  </RadioGroupPrimitives.Item>
)
