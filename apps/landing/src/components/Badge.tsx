import { cx } from '@repo/shared/utils'
import type { ComponentPropsWithoutRef, Ref } from 'react'

interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  ref?: Ref<HTMLSpanElement>
}

function Badge({ children, className, ref, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'z-10 block w-fit rounded-lg border border-indigo-200/20 bg-indigo-50/50 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tighter sm:text-sm dark:border-indigo-800/30 dark:bg-indigo-900/20',
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="text-dm-accent">{children}</span>
    </span>
  )
}

export { Badge, type BadgeProps }
