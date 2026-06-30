// Tremor Button [v0.2.0]

import { Slot } from '@radix-ui/react-slot'
import { RiLoader2Fill } from '@remixicon/react'
import { cx } from '@repo/shared/utils'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { buttonVariants } from './buttonVariants'

interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  ref?: Ref<HTMLButtonElement>
}

function Button({
  asChild,
  isLoading = false,
  loadingText,
  className,
  disabled,
  variant,
  children,
  ref,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      className={cx(buttonVariants({ variant }), className)}
      disabled={disabled || isLoading}
      ref={ref}
      tremor-id="tremor-raw"
      {...props}
    >
      {isLoading ? (
        <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
          <RiLoader2Fill aria-hidden="true" className="size-4 shrink-0 animate-spin" />
          <span className="sr-only">{loadingText ? loadingText : 'Loading'}</span>
          {loadingText ? loadingText : children}
        </span>
      ) : (
        children
      )}
    </Component>
  )
}

export { Button, type ButtonProps }
