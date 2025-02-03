"use client"
import { cx, focusRing } from "@/lib/utils"
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"
import { RiComputerLine, RiMoonLine, RiSunLine } from "@remixicon/react"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

// Based on Tremor Raw RadioGroup [v0.0.0]

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Root
      ref={forwardedRef}
      className={cx("grid gap-2", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item> & {
    icon: React.ElementType
  }
>(({ className, icon, ...props }, forwardedRef) => {
  const Icon = icon
  return (
    <RadioGroupPrimitives.Item
      ref={forwardedRef}
      className={cx(
        "group relative flex size-8 appearance-none items-center justify-center outline-none",
        className,
      )}
      {...props}
    >
      <div
        className={cx(
          // base
          "flex size-full shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-gray-400",
          // background color
          "bg-transparent",
          // checked
          "group-data-[state=checked]:bg-indigo-50 group-data-[state=checked]:text-indigo-600 dark:group-data-[state=checked]:bg-indigo-500/20 dark:group-data-[state=checked]:text-indigo-300",
          // focus
          focusRing,
        )}
      >
        <Icon className="size-4 text-inherit" />
      </div>
    </RadioGroupPrimitives.Item>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

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
      value={theme}
      onValueChange={(value) => {
        setTheme(value)
      }}
      className="flex gap-1"
    >
      <RadioGroupItem
        aria-label="Switch to System Mode"
        icon={RiComputerLine}
        value="system"
        id="system"
      />

      <RadioGroupItem
        aria-label="Switch to Light Mode"
        icon={RiSunLine}
        value="light"
        id="light"
      />

      <RadioGroupItem
        aria-label="Switch to Dark Mode"
        icon={RiMoonLine}
        value="dark"
        id="dark"
      />
    </RadioGroup>
  )
}

export default ThemeSwitch
