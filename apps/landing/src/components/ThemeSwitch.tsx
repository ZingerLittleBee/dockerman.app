'use client'
import * as RadioGroupPrimitives from '@radix-ui/react-radio-group'
import { RiComputerLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { cx, focusRing } from '@repo/shared/utils'

// Based on Tremor Raw RadioGroup [v0.0.0]

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Root
      className={cx('grid gap-2', className)}
      ref={forwardedRef}
      {...props}
    />
  )
})
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item> & {
    icon: React.ElementType
  }
>(({ className, icon, ...props }, forwardedRef) => {
  const Icon = icon
  return (
    <RadioGroupPrimitives.Item
      className={cx(
        'group relative flex size-8 appearance-none items-center justify-center outline-none',
        className
      )}
      ref={forwardedRef}
      {...props}
    >
      <div
        className={cx(
          // base
          'flex size-full shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-gray-400',
          // background color
          'bg-transparent',
          // checked
          'group-data-[state=checked]:bg-indigo-50 group-data-[state=checked]:text-indigo-600 dark:group-data-[state=checked]:bg-indigo-500/20 dark:group-data-[state=checked]:text-indigo-300',
          // focus
          focusRing
        )}
      >
        <Icon className="size-4 text-inherit" />
      </div>
    </RadioGroupPrimitives.Item>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <RadioGroup
      className="flex gap-1"
      onValueChange={(value) => {
        const fromTheme = theme
        setTheme(value)
        import('posthog-js').then(({ default: posthog }) => {
          posthog.capture('footer_theme_changed', {
            from_theme: fromTheme,
            to_theme: value,
            location: 'footer'
          })
        })
      }}
      value={theme}
    >
      <RadioGroupItem
        aria-label="Switch to System Mode"
        icon={RiComputerLine}
        id="system"
        value="system"
      />

      <RadioGroupItem aria-label="Switch to Light Mode" icon={RiSunLine} id="light" value="light" />

      <RadioGroupItem aria-label="Switch to Dark Mode" icon={RiMoonLine} id="dark" value="dark" />
    </RadioGroup>
  )
}

export default ThemeSwitch
